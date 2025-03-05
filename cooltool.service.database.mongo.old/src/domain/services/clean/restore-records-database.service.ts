import { Injectable, Inject, Logger  } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as zlib from 'zlib';
import * as JSONStream from 'JSONStream';

@Injectable()
export class RestoreRecordsDatabaseService {

    private BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-s3-bucket';
    private ARCHIVE_FOLDER = process.env.S3_ARCHIVE_FOLDER || 'mongo_archives/';

    private DefaultBatchSize = 500; // Define the size of each batch to recover
    
    private readonly logger = new Logger(RestoreRecordsDatabaseService.name);
    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: any,
        @Inject('S3') private readonly s3: any,
    ) { }

    /**
    * Principal function to restore old records
    */
    public async restoreBackupFromS3(collectionName: string, backupFileKey: string) {
        return new Promise<void>((resolve, reject) => {
            try {
                backupFileKey = `${this.ARCHIVE_FOLDER}${collectionName}/${backupFileKey}`;
                console.log(`🔄 Restoring records from ${backupFileKey} to ${collectionName}`);
    
                const collection = this.db.collection(collectionName);
                const batchSize = this.DefaultBatchSize; // Adjust based on your needs
                let batch: any[] = [];
                let totalRecords = 0;
    
                // Fetch file from S3 as a stream
                const s3Stream = this.s3.getObject({
                    Bucket: this.BUCKET_NAME,
                    Key: backupFileKey
                }).createReadStream();
    
                // Decompress and parse JSON
                const gunzipStream = zlib.createGunzip();
                const jsonStream = JSONStream.parse('*');
    
                s3Stream
                    .pipe(gunzipStream) // Decompress
                    .pipe(jsonStream) // Parse JSON objects
                    .on('data', async (record: any) => {
                        batch.push(record);
    
                        // When batch reaches batchSize, insert into MongoDB
                        if (batch.length >= batchSize) {
                            jsonStream.pause(); // Pause stream while inserting
                            await collection.insertMany(batch);
                            totalRecords += batch.length;
                            console.log(`✅ Inserted ${totalRecords} records so far...`);
                            batch = [];
                            jsonStream.resume(); // Resume stream after insert
                        }
                    })
                    .on('end', async () => {
                        // Insert any remaining records
                        if (batch.length > 0) {
                            await collection.insertMany(batch);
                            totalRecords += batch.length;
                        }
    
                        console.log(`🎉 Successfully restored ${totalRecords} records to ${collectionName}`);
    
                        // Delete backup file from S3 after successful restore
                        await this.s3.deleteObject({
                            Bucket: this.BUCKET_NAME,
                            Key: backupFileKey
                        }).promise();
                        console.log(`🗑️ Deleted backup file ${backupFileKey} from S3`);
    
                        resolve(); // Resolve Promise when done
                    })
                    .on('error', (error) => {
                        console.error(`❌ Error restoring backup:`, error);
                        reject(error);
                    });
            } catch (error) {
                console.error(`❌ Error restoring backup:`, error);
                reject(error);
            }
        });
    }
}
