import { Injectable, Inject, Logger  } from '@nestjs/common';
import { excludeCollectionsToRemove } from 'src/domain/const/exclude-collections-to-remove';
import * as zlib from 'zlib';
import { calculateObjectSize } from 'bson';
import { PassThrough } from 'stream';

@Injectable()
export class CleanupRecordsDatabaseService {

    private readonly BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-s3-bucket';
    private readonly ARCHIVE_FOLDER = process.env.S3_ARCHIVE_FOLDER || 'mongo_archives/';
    private readonly STORAGE_CLASS = process.env.S3_STORAGE_CLASS || 'STANDARD_IA';
    private readonly MaxSizeToSave = 10 * 1024 * 1024; // 300MB in bytes
    private readonly DefaultBatchSize = 500;
    private readonly DefaultYearsAgoToRemove = 5;
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
                    SizeFileS3: config?.SizeFileS3 ? (config.SizeFileS3 * 1024 * 1024) : this.MaxSizeToSave
                };
            })
            .filter(Boolean); // Removes undefined values;

            await Promise.all(collectionsWithConfig.map((config) => this.processCollection(config)));

            console.debug('✅ Cleanup completed for all applicable collections.');
        } catch (err) {
            console.error('❌ Error during cleanup:', err);
        }finally {
            // await this.db.close();
        }
    }

    private async processCollection(config: any) {
        const { BatchSize, collectionName, FieldToCheck, YearsAgoToRemove, Prefix, QueryToRemove, SizeFileS3 } = config;
        let lastId = null;
        let moreRecordsToProcess = true;
    
        this.logger.log(`🚀 Processing collection: ${collectionName}`);
    
        while (moreRecordsToProcess) {
            let totalSizeBytes = 0;
            let compressedSizeBytes = 0;
            let firstBatch = true;
            let recordsBuffer: string[] = []; // Store only _id values
            let counterRecordsProcessed = 0;
    
            const fileName = `${this.ARCHIVE_FOLDER}${collectionName}/backup_prefix_${Prefix}_${Date.now()}.json.gz`;
            const jsonStream = new PassThrough();
            const gzipStream = zlib.createGzip();
    
            gzipStream.on('data', (chunk) => {
                compressedSizeBytes += chunk.length;
            });
    
            const uploadStream = this.s3.upload({
                Bucket: this.BUCKET_NAME,
                Key: fileName,
                Body: jsonStream.pipe(gzipStream),
                ContentEncoding: 'gzip',
                ContentType: 'application/json',
                StorageClass: this.STORAGE_CLASS,
            }).promise();
    
            jsonStream.write('['); // Start JSON array
    
            this.logger.log(`✅ File created to save data in S3: ${this.BUCKET_NAME}/${fileName}, size expected: ${SizeFileS3/(1024 * 1024)} MB`);
    
            try {
                while (compressedSizeBytes < SizeFileS3) {
                    const { recordsToRemove, lastProcessedId, batchSizeBytes } = await this.getRecordsToRemove(
                        collectionName,
                        FieldToCheck,
                        YearsAgoToRemove,
                        BatchSize,
                        lastId,
                        QueryToRemove
                    );
    
                    if (recordsToRemove.length === 0) {
                        moreRecordsToProcess = false;
                        break;
                    }
    
                    if (!firstBatch) jsonStream.write(',');
                    firstBatch = false;
    
                    recordsToRemove.forEach((record, index) => {
                        jsonStream.write(JSON.stringify(record));
                        if (index < recordsToRemove.length - 1) jsonStream.write(',');
                    });
    
                    totalSizeBytes += batchSizeBytes;
                    recordsBuffer.push(...recordsToRemove.map((record) => record._id)); // Store only _id
                    lastId = lastProcessedId;
    
                    counterRecordsProcessed += recordsToRemove.length;
    
                    this.logger.log(`⚡ Added docs til' having more than ${SizeFileS3/(1024 * 1024)} MB : ${(compressedSizeBytes/(1024 * 1024)).toFixed(2)} MB, total records to del: ${counterRecordsProcessed}, last Id: ${lastProcessedId}`);
                }
            } catch (err) {
                this.logger.error(`❌ Error processing ${collectionName}:`, err);
            } finally {
                jsonStream.write(']'); // Close JSON array
                jsonStream.end();
                await uploadStream;
                this.logger.log(`✅ Uploaded ${(compressedSizeBytes/(1024 * 1024)).toFixed(2)} MB (original: ${(totalSizeBytes/(1024 * 1024)).toFixed(2)} MB) to S3`);
    
                // 🔥 Delete processed records from MongoDB
                if (recordsBuffer.length > 0) {
                    await this.removeRecordsFromMongo(collectionName, recordsBuffer);
                }
            }
    
            this.logger.log(`🔁 Continuing process for ${collectionName}...`);
        }
    
        this.logger.log(`✅ Finished processing collection: ${collectionName}`);
    }    

    private async removeRecordsFromMongo(collectionName: string, idsToDelete: string[]) {
        if (idsToDelete.length === 0) return;

        const deleteResult = await this.db.collection(collectionName).deleteMany({ _id: { $in: idsToDelete } });

        this.logger.log(`🗑️ Deleted ${deleteResult.deletedCount} records from ${collectionName}`);
    }

    private async getRecordsToRemove(
        collectionName: string,
        fieldToCheck: string,
        yearsAgo: number,
        batchSize: number,
        lastId: any,
        query: any
    ) {
        const dateThreshold = new Date();
        dateThreshold.setFullYear(dateThreshold.getFullYear() - yearsAgo);

        const batchQuery = lastId ? { ...query, _id: { $gt: lastId } } : query;
            
        const batch = await this.db
            .collection(collectionName)
            .find(batchQuery)
            .limit(batchSize)
            .toArray();

        if (batch.length === 0) return { recordsToRemove: [], lastProcessedId: null, batchSizeBytes: 0 };

        // Calculate uncompressed batch size
        const batchSizeBytes = batch.reduce((total, record) => total + calculateObjectSize(record), 0);

        return { recordsToRemove: batch, lastProcessedId: batch[batch.length - 1]._id, batchSizeBytes };
    }

}
