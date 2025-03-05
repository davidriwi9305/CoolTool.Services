import { Injectable, Inject, Logger  } from '@nestjs/common';
import { excludeCollectionsToRemove } from 'src/domain/const/exclude-collections-to-remove';
import { S3 } from 'aws-sdk';
import * as zlib from 'zlib';
import { calculateObjectSize } from 'bson';

@Injectable()
export class CleanupRecordsDatabaseService {

    private s3 = new S3({ 
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1'
     });
    private BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-s3-bucket';
    private ARCHIVE_FOLDER = process.env.S3_ARCHIVE_FOLDER || 'mongo_archives/';
    private STORAGE_CLASS = process.env.S3_STORAGE_CLASS || 'STANDARD_IA ';

    private readonly logger = new Logger(CleanupRecordsDatabaseService.name);
    
    private DefaultBatchSize = 1000; // Define the size of each batch
    private DefaultYearsAgoToRemove = 5;

    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: any,
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
                return {
                    collectionName: collection.name,
                    BatchSize: config?.BatchSize ?? this.DefaultBatchSize, // Default to the service-level BatchSize
                    YearsAgoToRemove: config?.YearsAgoToRemove ?? this.DefaultYearsAgoToRemove, // Default to service-level YearsAgoToRemove
                    UpdateIndex: config?.UpdateIndex ?? true,
                    FieldToCheck: config?.FieldToCheck ?? "LastUpdated",
                    QueryToRemove: config?.QueryToRemove
                };
            });

            const collectionPromises = collectionsWithConfig.map(async (config) => {

                const { BatchSize, collectionName, YearsAgoToRemove, UpdateIndex, FieldToCheck } = config;

                let hasMoreRecords = true;
                let counterRecordsProcessed = 0;

                console.debug(`Starting to process collection: ${collectionName}, Batch: ${BatchSize}, YearsAgoToRemove: ${YearsAgoToRemove}, FieldToCheck: ${FieldToCheck}`);

                try {

                    while (hasMoreRecords) {
                        // Fetch a batch of records
                        let recordsToRemove;
                        ({ recordsToRemove, counterRecordsProcessed } = await this.getRecordsToRemove(config, counterRecordsProcessed));

                        if (recordsToRemove.length > 0) {

                            let insertResult;

                            ({ insertResult } = await this.insertingRecordsToRemoveToBackup(insertResult, collectionName, recordsToRemove));
                            await this.removingRecordsFromMain(insertResult, recordsToRemove, collectionName);
                            
                        } else {
                            console.log(`${collectionName} has not more records to process, total processed: ${counterRecordsProcessed}`);
                            hasMoreRecords = false;
                        }
                    }

                } catch (err) {

                    console.error(`Error processing ${collectionName}:`, err);
                }
            });

            await Promise.all(collectionPromises);
            console.debug('Cleanup completed for all applicable collections.');
        } catch (err) {
            console.error('Error during cleanup:', err);
        }finally {
            // await this.db.close();
        }
    }

    /**
    * Ensures necessary removing records from main database
    */
    private async removingRecordsFromMain(insertResult: any, recordsToRemove: any, collectionName: any) {
        if (insertResult && insertResult.ETag) {
            const idsToDelete = recordsToRemove.map((record) => record._id);
            const deleteResult = await this.db.collection(collectionName).deleteMany({ _id: { $in: idsToDelete } });
            console.log(`Deleted ${deleteResult.deletedCount} records from ${collectionName} inside Main Database`);
        } else {
            console.warn(`Not all records were backed up to ${collectionName}. Expected: ${recordsToRemove.length}, Inserted: ${insertResult.insertedCount}`);
        }
    }

    private async insertingRecordsToRemoveToBackup(insertResult: any, collectionName: any, recordsToRemove: any) {
        let savedBackup = false
        do {
            try {
                const compressedData = zlib.gzipSync(JSON.stringify(recordsToRemove));
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const fromId = recordsToRemove[0]?._id.toString() || 'start';
                const toId = recordsToRemove[recordsToRemove.length - 1]?._id.toString() || 'end';
                const fileName = `${this.ARCHIVE_FOLDER}${collectionName}/backup_fromId_${fromId}_toId_${toId}_${year}-${month}-${day}.gz`;
                
                console.debug(`Saving in bucket`);

                insertResult = await this.s3.putObject({
                    Bucket: this.BUCKET_NAME,
                    Key: fileName,
                    Body: compressedData,
                    ContentEncoding: 'gzip',
                    ContentType: 'application/json',
                    StorageClass: this.STORAGE_CLASS,
                }).promise();

                savedBackup = true;

                console.debug(`Saved elements inside bucket: ${this.BUCKET_NAME}/${fileName}`);
            } catch (error) {
                console.log(error)
                console.log(`Data found in backup S3 storage, processing removal and restarting process`);
                savedBackup = false;
                console.warn(`Restart process to save data`);
            }
        } while (!savedBackup);
        return { insertResult, savedBackup };
    }

    private async getRecordsToRemove(config: any, counterRecordsProcessed: number) {
    
        const currentDate = new Date();
        const yearsAgo = new Date();
        let {  BatchSize, YearsAgoToRemove, collectionName, FieldToCheck, QueryToRemove } = config;
        
        yearsAgo.setFullYear(currentDate.getFullYear() - YearsAgoToRemove);

        const query = QueryToRemove ?? {[FieldToCheck]: { $lt: yearsAgo }};
        let recordsToRemove;
        // const firstRecord = await this.db.collection(collectionName).findOne(query);
        const onlyRecordsIds = await this.db.collection(collectionName)
                                .find(query)
                                .sort({ _id: 1 }) // Sort by _id for consistent batching
                                .limit(1) // Fetch only one record
                                .project({ _id: 1 }) // Only fetch required fields, if applicable
                                .toArray();

        console.log(yearsAgo, onlyRecordsIds[0]?._id)
        try {
            recordsToRemove = await this.db
            .collection(collectionName)
            .find(query)
            .limit(BatchSize)
            .sort({ _id: 1 }) // Sort by _id to ensure consistent batching
            .toArray();
        } catch (error) {
            console.log('Get records to remove having problems', error)
        }
        counterRecordsProcessed += recordsToRemove.length;
        console.log(`${collectionName} total records to process: ${counterRecordsProcessed}`);
        return { recordsToRemove, counterRecordsProcessed };
    }

    public async restoreBackupFromS3(collectionName: string, backupFileKey: string) {
        try {
            console.log(`Restoring  records from ${backupFileKey} to ${collectionName}`);
            const collection = this.db.collection(collectionName);
            const s3Object = await this.s3.getObject({
                Bucket: this.BUCKET_NAME,
                Key: backupFileKey
            }).promise();
            
            const decompressedData = JSON.parse(zlib.gunzipSync(s3Object.Body as Buffer).toString());
            
            await collection.insertMany(decompressedData);
            console.log(`Restored ${decompressedData.length} records to ${collectionName}`);

            // Delete the file from S3 after successful restoration
            await this.s3.deleteObject({
                Bucket: this.BUCKET_NAME,
                Key: backupFileKey
            }).promise();
            console.log(`Deleted backup file ${backupFileKey} from S3`);
        } catch (error) {
            console.error(`Error restoring backup:`, error);
        } finally {
            // await this.db.close();
        }
    }
}
