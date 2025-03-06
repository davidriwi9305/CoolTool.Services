import { Injectable, Inject, Logger  } from '@nestjs/common';
import { excludeCollectionsToRemove } from 'src/domain/const/exclude-collections-to-remove';
import * as zlib from 'zlib';
import { calculateObjectSize } from 'bson';
import { PassThrough } from 'stream';

@Injectable()
export class CleanupRecordsDatabaseService {

    private BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-s3-bucket';
    private ARCHIVE_FOLDER = process.env.S3_ARCHIVE_FOLDER || 'mongo_archives/';
    private STORAGE_CLASS = process.env.S3_STORAGE_CLASS || 'STANDARD_IA ';

    private MaxSizeToSave = 300 //MB
    private DefaultBatchSize = 500; // Define the size of each batch
    private DefaultYearsAgoToRemove = 5;

    private readonly logger = new Logger(CleanupRecordsDatabaseService.name);
    

    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: any,
        @Inject('S3') private readonly s3: any,
    ) { }

    /**
    * Principal function to clean old records
    */
    async cleanupOldRecords(): Promise<void> {
        try {
            console.log(process.memoryUsage());

            const collections = await this.db.listCollections().toArray();

            // Filter out excluded collections using `Name` and `Excluded`
            const collectionsToProcess = collections.filter((collection) => {
                const excludeConfig = excludeCollectionsToRemove.find(
                    (excludeItem) => excludeItem.Name === collection.name
                );
                return !excludeConfig?.Excluded; // Process collections only if not excluded
            });

            // Map collections with their specific configuration
            const collectionsWithConfig = collectionsToProcess.map((collection) => {
                
                const config = excludeCollectionsToRemove.find(
                    (excludeItem) => excludeItem.Name === collection.name
                );

                if(config?.Excluded == true || config?.Excluded == undefined) return;

                return {
                    collectionName: collection.name,
                    BatchSize: config?.BatchSize ?? this.DefaultBatchSize, // Default to the service-level BatchSize
                    YearsAgoToRemove: config?.YearsAgoToRemove ?? this.DefaultYearsAgoToRemove, // Default to service-level YearsAgoToRemove
                    UpdateIndex: config?.UpdateIndex ?? true,
                    FieldToCheck: config?.FieldToCheck ?? "LastUpdated",
                    QueryToRemove: config?.QueryToRemove,
                    Prefix: config?.Prefix ?? "",
                };
            })
            .filter(Boolean); // Removes undefined values;

            const collectionPromises = collectionsWithConfig.map(async (config) => {

                const { BatchSize, collectionName, Prefix } = config;

                let hasMoreRecords = true;
                let counterRecordsProcessed = 0;

                console.debug(`🚀 Starting to process collection: ${collectionName}, Batch: ${BatchSize}`);

                try {

                    while (hasMoreRecords) {
                        // Fetch a batch of records
                        let recordsToRemove;
                        ({ recordsToRemove, counterRecordsProcessed } = await this.getRecordsToRemove(config, counterRecordsProcessed));

                        if (recordsToRemove.length > 0) {

                            let savedBackup = false;

                            ({ savedBackup } = await this.insertingRecordsToRemoveToBackup(savedBackup, collectionName, recordsToRemove, Prefix));
                            await this.removingRecordsFromMain(savedBackup, recordsToRemove, collectionName);
                            
                        } else {
                            console.log(`📢 ${collectionName} has not more records to process, total processed: ${counterRecordsProcessed}`);
                            hasMoreRecords = false;
                        }
                    }

                } catch (err) {

                    console.error(`❌ Error processing ${collectionName}:`, err);
                }
            });

            await Promise.all(collectionPromises);
            console.debug('✅ Cleanup completed for all applicable collections.');
        } catch (err) {
            console.error('❌ Error during cleanup:', err);
        }finally {
            // await this.db.close();
        }
    }

    /**
    * Ensures necessary removing records from main database
    */
    private async removingRecordsFromMain(savedBackup: any, recordsToRemove: any, collectionName: any) {
        // console.log({savedBackup})
        if (savedBackup) {
            const idsToDelete = recordsToRemove.map((record) => record._id);
            const deleteResult = await this.db.collection(collectionName).deleteMany({ _id: { $in: idsToDelete } });
            console.log(`🗑️ Deleted ${deleteResult.deletedCount} records from ${collectionName} inside Main Database`);
        } else {
            console.warn(`❌ Not all records were backed up to ${collectionName}. Expected: ${recordsToRemove.length}`);
        }
    }

    private async insertingRecordsToRemoveToBackup(savedBackup: boolean, collectionName: any, recordsToRemove: any, prefix: string) {
    
        do {
            try {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const fromId = recordsToRemove[0]?._id.toString() || 'start';
                const toId = recordsToRemove[recordsToRemove.length - 1]?._id.toString() || 'end';
                const fileName = `${this.ARCHIVE_FOLDER}${collectionName}/backup_fromId_${fromId}_toId_${toId}_total_records_${recordsToRemove.length}_prefix_${prefix}_date_${year}-${month}-${day}.gz`;

                console.debug(`📤 Saving large file in S3 via streaming...`);
    
                const jsonStream = new PassThrough();
                const gzipStream = zlib.createGzip();
    
                // Create an S3 upload stream
                const uploadStream = this.s3.upload({
                    Bucket: this.BUCKET_NAME,
                    Key: fileName,
                    Body: jsonStream.pipe(gzipStream), // Compress as it streams
                    ContentEncoding: 'gzip',
                    ContentType: 'application/json',
                    StorageClass: this.STORAGE_CLASS,
                }).promise();
    
                // Write JSON objects as a stream (avoiding large in-memory strings)
                jsonStream.write('['); // Start JSON array
                for (let i = 0; i < recordsToRemove.length; i++) {
                    jsonStream.write(JSON.stringify(recordsToRemove[i]));
                    if (i < recordsToRemove.length - 1) jsonStream.write(','); // Add commas between objects
                }
                jsonStream.write(']'); // End JSON array
                jsonStream.end(); // Close the stream
    
                await uploadStream; // Wait for the upload to complete
                savedBackup = true;
    
                console.debug(`✅ Large file saved successfully in S3: ${this.BUCKET_NAME}/${fileName}`);
            } catch (error) {
                console.error(`❌ Error while saving large file to S3:`, error);
                savedBackup = false;
                console.warn(`🔄 Restarting process to save data...`);
            }
        } while (!savedBackup);
    
        return { savedBackup };
    }

    private async getRecordsToRemove(config: any, counterRecordsProcessed: number) {
    
        const currentDate = new Date();
        const yearsAgo = new Date();
        let {  BatchSize, YearsAgoToRemove, collectionName, FieldToCheck, QueryToRemove } = config;
        
        yearsAgo.setFullYear(currentDate.getFullYear() - YearsAgoToRemove);

        const query = QueryToRemove ?? {[FieldToCheck]: { $lt: yearsAgo }};
        let recordsToRemove: any[] = [];
        let totalSizeBytes = 0;
        const maxSizeBytes = this.MaxSizeToSave * 1024 * 1024; // 300MB
        let lastId = null; // Track last document ID for pagination
        let exceededLimit = false;

        await this.printIdWhereStarts(collectionName, query, yearsAgo);

        try {
            while (!exceededLimit) {
                // Adjust query for pagination
                const batchQuery = lastId ? { ...query, _id: { $gt: lastId } } : query;
    
                const batch = await this.db
                    .collection(collectionName)
                    .find(batchQuery)
                    .limit(BatchSize)
                    .sort({ _id: 1 }) // Sort by _id to ensure consistent batching
                    .toArray();
    
                if (batch.length === 0) break; // Stop if no more records
    
                let batchSizeBytes = batch.reduce((sum, doc) => sum + calculateObjectSize(doc), 0);
                
                // If adding the full batch exceeds 300MB, we stop after this batch
                if (totalSizeBytes + batchSizeBytes > maxSizeBytes) {
                    exceededLimit = true; // Mark as last batch
                }
    
                for (const doc of batch) {
                    totalSizeBytes += calculateObjectSize(doc);
                    recordsToRemove.push(doc);
                    lastId = doc._id; // Update last processed ID
                    counterRecordsProcessed++;
                }

                console.log(`⚡ Accumulating documents until having more than ${this.MaxSizeToSave} MB, Current: ${(totalSizeBytes/(1024 * 1024)).toFixed(2)} MB, total records to remove: ${counterRecordsProcessed}`);

            }
        } catch (error) {
            console.log('❌ Get records to remove having problems', error)
        }
        console.debug(`📢 ${collectionName} total records to process: ${counterRecordsProcessed}, size: ${(totalSizeBytes/(1024 * 1024)).toFixed(2)} MB`);
        return { recordsToRemove, counterRecordsProcessed };
    }

    private async printIdWhereStarts(collectionName: string, query:any, yearsAgo:any) {
        const onlyRecordsIds = await this.db.collection(collectionName)
            .find(query)
            .sort({ _id: 1 }) // Sort by _id for consistent batching
            .limit(1) // Fetch only one record
            .project({ _id: 1 }) // Only fetch required fields, if applicable
            .toArray();
        console.log("📌 Query", query, onlyRecordsIds[0]?._id);
    }
}
