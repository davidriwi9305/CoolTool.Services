import { Injectable, Inject } from '@nestjs/common';
import { excludeCollectionsToRemove } from 'src/domain/const/exclude-collections-to-remove';
import { CollectionSizeDatabaseService } from '../collections-size-database.service';
import { ObjectId, MongoClient } from 'mongodb';

@Injectable()
export class CleanupRecordsDatabaseService {
    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: any,
        @Inject('DATABASE_CONNECTION_BACKUP') private readonly dbb: any,
        private readonly collectionSizeDatabaseService: CollectionSizeDatabaseService, // Inject domain service
    ) { }

    async cleanupOldRecords(): Promise<void> {
        try {
            // Collections to exclude
            const excludeCollections = excludeCollectionsToRemove

            // Get all collection names
            const collections = await this.db.listCollections().toArray();

            // Filter out excluded collections
            const collectionsToProcess = collections.filter(
                (collection) => !excludeCollections.includes(collection.name)
            );

            const currentDate = new Date();
            const yearsAgoToRemove = 5;
            const yearsAgo = new Date();


            const collectionPromises = collectionsToProcess.map(async (collection) => {

                const collectionName = collection.name;
                const batchSize = 1000; // Define the size of each batch
                let hasMoreRecords = true;
                let lastProcessedId = null;
                let counterRecordsProcessed = 0;
                console.log(`Processing collection: ${collectionName}`);
                yearsAgo.setFullYear(currentDate.getFullYear() - yearsAgoToRemove);

                try {
                    // Ensure indexes are in place
                    await this.ensureBackupIndexes(collectionName);
                    console.log(`${collectionName}: Indexes Created`);

                    while (hasMoreRecords) {
                        // Fetch a batch of records
                        const query = {
                            $or: [
                                { LastUpdated: { $lt: yearsAgo } },
                                { _id: lastProcessedId ? { $gt: lastProcessedId, $lt: ObjectId.createFromTime(yearsAgo.getTime() / 1000) } : { $lt: ObjectId.createFromTime(yearsAgo.getTime() / 1000) } }
                            ]
                        };

                        const recordsToRemove = await this.db
                            .collection(collectionName)
                            .find(query)
                            .sort({ _id: 1 }) // Sort by _id to ensure consistent batching
                            .limit(batchSize)
                            .toArray();

                        counterRecordsProcessed += recordsToRemove.length;
                        console.log(`${collectionName} has more records, total processed: ${counterRecordsProcessed}`);

                        if (recordsToRemove.length > 0) {

                            let insertResult;
                            let savedBackup = false

                            do {
                                try {
                                    insertResult  =  await this.dbb.collection(collectionName).insertMany(recordsToRemove, { ordered: false });
                                    savedBackup = true
                                } catch (error) {
                                    console.log(`Data found in backup Database processing using updateOne`)
                                    // If exist some repeat records, we remove data to start again to insert
                                    const idsToDelete = recordsToRemove.map((record) => record._id);
                                    await this.dbb.collection(collectionName).deleteMany({ _id: { $in: idsToDelete } });
                                    savedBackup = false
                                    console.log(`Restart process to save data`)
                                }
                            } while (!savedBackup);


                            if (insertResult && insertResult.insertedCount === recordsToRemove.length) {
                                console.log(`Successfully backed up ${insertResult.insertedCount} records to ${collectionName} inside Backup Database`);

                                const idsToDelete = recordsToRemove.map((record) => record._id);
                                const deleteResult = await this.db.collection(collectionName).deleteMany({ _id: { $in: idsToDelete } });
                                console.log(`Deleted ${deleteResult.deletedCount} records from ${collectionName} inside Main Database`);

                            } else {
                                console.warn(`Not all records were backed up to ${collectionName}. Expected: ${recordsToRemove.length}, Inserted: ${insertResult.insertedCount}`);
                            }
                        } else {
                            console.log(`${collectionName} has not more records to process, total processed: ${counterRecordsProcessed}`);
                            hasMoreRecords = false;
                        }

                        console.log(`Completed processing for collection: ${collectionName}`);
                    }

                    console.log('Cleanup completed for all applicable collections.');

                } catch (err) {

                    console.error(`Error processing ${collectionName}:`, err);
                }
            });

            await Promise.all(collectionPromises);

            console.log('Cleanup completed for all applicable collections.');
        } catch (err) {
            console.error('Error during cleanup:', err);
        }
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
