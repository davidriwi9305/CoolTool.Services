import { Injectable } from '@nestjs/common';
import { CleanupRecordsDatabaseService } from 'src/domain/services/clean/clean-up-records-database.service';

@Injectable()
export class CleanupDatabaseUseCase {
  constructor(
    private readonly cleanupOldRecordsDatabaseService: CleanupRecordsDatabaseService, // Inject domain service
  ) {}

  async oldRecords(): Promise<boolean> {
    await this.cleanupOldRecordsDatabaseService.cleanupOldRecords();
    return true;
  }
}