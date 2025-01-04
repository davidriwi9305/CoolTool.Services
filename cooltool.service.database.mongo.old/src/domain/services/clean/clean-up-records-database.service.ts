import { Injectable, Inject } from '@nestjs/common';
import { excludeCollectionsToRemove } from 'src/domain/const/exclude-collections-to-remove';
import { ObjectId } from 'mongodb';

@Injectable()
export class CleanupRecordsDatabaseService {
    
    private DefaultBatchSize = 1000; // Define the size of each batch
    private DefaultYearsAgoToRemove = 5;

    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: any,
        @Inject('DATABASE_CONNECTION_BACKUP') private readonly dbb: any,
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
                    if(UpdateIndex){
                        await this.ensureBackupIndexes(collectionName);
                    }

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
        }
    }

    /**
    * Ensures necessary removing records from main database
    */
    private async removingRecordsFromMain(insertResult: any, recordsToRemove: any, collectionName: any) {
        if (insertResult && insertResult.insertedCount === recordsToRemove.length) {
            console.log(`Successfully backed up ${insertResult.insertedCount} records to ${collectionName} inside Backup Database`);

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
                insertResult = await this.dbb.collection(collectionName).insertMany(recordsToRemove, { ordered: false });
                savedBackup = true;
            } catch (error) {
                console.log(`Data found in backup Database processing removing and restarting process`);
                // If exist some repeat records, we remove data to start again to insert
                const idsToDelete = recordsToRemove.map((record) => record._id);
                await this.dbb.collection(collectionName).deleteMany({ _id: { $in: idsToDelete } });
                savedBackup = false;
                console.warn(`Restart process to save data`);
            }
        } while (!savedBackup);
        return { insertResult, savedBackup };
    }

    private async getRecordsToRemove(config: any, counterRecordsProcessed: number) {
    
        const currentDate = new Date();
        const yearsAgo = new Date();
        const {  BatchSize, YearsAgoToRemove, collectionName, FieldToCheck, QueryToRemove } = config;
        
        yearsAgo.setFullYear(currentDate.getFullYear() - YearsAgoToRemove);

        const query = QueryToRemove ?? {[FieldToCheck]: { $lt: yearsAgo }};
        
        const recordsToRemove = await this.db
            .collection(collectionName)
            .find(query)
            .limit(BatchSize)
            .sort({ _id: 1 }) // Sort by _id to ensure consistent batching
            .toArray();

        counterRecordsProcessed += recordsToRemove.length;
        console.log(`${collectionName} total records to processe: ${counterRecordsProcessed}`);
        return { recordsToRemove, counterRecordsProcessed };
    }

    /**
    * Ensures necessary indexes are in place for efficient querying.
    */
    private async ensureBackupIndexes(collectionName: string): Promise<void> {
        try {
            console.log(`Ensuring indexes for backup collection: ${collectionName} inside backup database`);

            const mainIndexes = await this.db.collection(collectionName).indexes();

            for (const index of mainIndexes) {
                // Create index in the backup collection
                const indexKey = index.key;
                const indexOptions = { ...index, key: undefined }; // Remove the key, it will be passed separately
                await this.dbb.collection(collectionName).createIndex(indexKey, indexOptions);
            }

            console.log(`Indexes ensured for backup collection: ${collectionName}  inside backup database`);
        } catch (err) {
            console.error(`Error ensuring indexes inside backup database for ${collectionName}:`, err);
        }
    }
}
