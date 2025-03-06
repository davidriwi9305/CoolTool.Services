import { Injectable, Inject, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as zlib from 'zlib';
import * as JSONStream from 'JSONStream';

@Injectable()
export class RestoreRecordsDatabaseService {
    private BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-s3-bucket';
    private ARCHIVE_FOLDER = process.env.S3_ARCHIVE_FOLDER || 'mongo_archives/';
    private DefaultBatchSize = 500;
    private readonly logger = new Logger(RestoreRecordsDatabaseService.name);

    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: any,
        @Inject('S3') private readonly s3: S3,
    ) {}

    public async restoreBackupFromS3(collectionName: string, backupFileKey: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            try {
                backupFileKey = `${this.ARCHIVE_FOLDER}${collectionName}/${backupFileKey}`;
                console.log(`🔄 Restoring records from ${backupFileKey} to ${collectionName}`);

                const collection = this.db.collection(collectionName);
                let batch: any[] = [];
                let totalRecords = 0;
                let restoreFailed = false;
                let insertPromises: Promise<any>[] = [];

                let firstRestoredId: any = null;
                let lastRestoredId: any = null;

                const s3Stream = this.s3.getObject({
                    Bucket: this.BUCKET_NAME,
                    Key: backupFileKey
                }).createReadStream();

                const gunzipStream = zlib.createGunzip();
                const jsonStream = JSONStream.parse('*');

                s3Stream
                    .pipe(gunzipStream)
                    .pipe(jsonStream)
                    .on('data', async (record: any) => {
                        if (!firstRestoredId) firstRestoredId = record._id;
                        lastRestoredId = record._id;

                        // Ensure `LastUpdated` and `CreateDate` are stored as Date
                        if (record.LastUpdated) record.LastUpdated = new Date(record.LastUpdated);
                        if (record.CreateDate) record.CreateDate = new Date(record.CreateDate);

                        batch.push(record);

                        if (batch.length >= this.DefaultBatchSize) {
                            jsonStream.pause();

                            insertPromises.push(
                                Promise.all(batch.map(doc => 
                                    collection.updateOne(
                                        { _id: doc._id }, // Match by _id
                                        { $set: doc },    // Overwrite fields
                                        { upsert: true }  // Insert if not exists
                                    )
                                )).catch(err => {
                                    console.error(`⚠️ Insert error:`, err);
                                    restoreFailed = true;
                                })
                            );

                            totalRecords += batch.length;
                            console.log(`✅ Inserted ${totalRecords} records so far...`);
                            batch = [];
                            jsonStream.resume();
                        }
                    })
                    .on('end', async () => {
                        try {
                            if (batch.length > 0) {
                                insertPromises.push(
                                    Promise.all(batch.map(doc => 
                                        collection.updateOne(
                                            { _id: doc._id },
                                            { $set: doc },
                                            { upsert: true }
                                        )
                                    )).catch(err => {
                                        console.error(`⚠️ Insert error:`, err);
                                        restoreFailed = true;
                                    })
                                );
                                totalRecords += batch.length;
                            }

                            await Promise.all(insertPromises);

                            const firstDocId = await collection.findOne({ _id: firstRestoredId });
                            console.log('🔍 Verified First restored doc:', firstDocId._id);

                            const lastDocId = await collection.findOne({ _id: lastRestoredId });
                            console.log('🔍 Verified Last restored doc:', lastDocId?._id);

                            if (!restoreFailed && firstDocId != undefined && lastDocId != undefined) {
                                console.log(`🎉 Successfully restored ${totalRecords} records to ${collectionName}`);

                                await this.s3.deleteObject({
                                    Bucket: this.BUCKET_NAME,
                                    Key: backupFileKey
                                }).promise();
                                console.log(`🗑️ Deleted backup file ${backupFileKey} from S3`);
                            } else {
                                console.warn(`⚠️ Some records failed to restore, backup file **not** deleted.`);
                            }

                            resolve();
                        } catch (error) {
                            console.error(`❌ Error during final insert:`, error);
                            reject(error);
                        }
                    })
                    .on('error', (error) => {
                        console.error(`❌ Stream error:`, error);
                        reject(error);
                    });
            } catch (error) {
                console.error(`❌ Error restoring backup:`, error);
                reject(error);
            }
        });
    }
}
