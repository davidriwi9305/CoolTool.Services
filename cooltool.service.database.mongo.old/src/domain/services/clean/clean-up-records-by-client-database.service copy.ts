import { Injectable, Inject, Logger  } from '@nestjs/common';
import { excludeCollectionsToRemove } from 'src/domain/const/exclude-collections-to-remove';
import * as zlib from 'zlib';
import { calculateObjectSize } from 'bson';
import { PassThrough } from 'stream';

@Injectable()
export class CleanupRecordsByClientDatabaseService {

    private readonly BUCKET_NAME = process.env.S3_BUCKET_NAME || 'your-s3-bucket';
    private readonly ARCHIVE_FOLDER = process.env.S3_ARCHIVE_FOLDER || 'client/mongo_archives/';
    private readonly STORAGE_CLASS = process.env.S3_STORAGE_CLASS || 'STANDARD_IA';
    private readonly logger = new Logger(CleanupRecordsByClientDatabaseService.name);
    
    constructor(
        @Inject('DATABASE_CONNECTION') private readonly db: any,
        @Inject('S3') private readonly s3: any,
    ) { }

    /**
    * Principal function to backup specific client
    */
    async backupByClient(clientId: number): Promise<void> {
        try {
            console.log(clientId)

        } catch (err) {
        }finally {

        }
    }



}
