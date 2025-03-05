import { Injectable } from '@nestjs/common';
import { CleanupRecordsDatabaseService } from 'src/domain/services/clean/clean-up-records-database.service';
import { RestoreRecordsDatabaseService } from 'src/domain/services/clean/restore-records-database.service';

@Injectable()
export class CleanupDatabaseUseCase {
  constructor(
    private readonly cleanupOldRecordsDatabaseService: CleanupRecordsDatabaseService, // Inject domain service
    private readonly restoreRecordsDatabaseService: RestoreRecordsDatabaseService , // Inject domain service
  ) {}

  async oldRecords(): Promise<boolean> {
    await this.cleanupOldRecordsDatabaseService.cleanupOldRecords();
    return true;
  }

  async recoverRecords(collection: string, backupFileKey: string): Promise<boolean> {
    await this.restoreRecordsDatabaseService.restoreBackupFromS3(collection, backupFileKey);
    return true;
  }
}