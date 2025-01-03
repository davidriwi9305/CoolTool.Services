import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CleanupDatabaseUseCase } from './application/use-cases/clean-up-database.use-case';
import { CleanupRecordsDatabaseService } from './domain/services/clean/clean-up-records-database.service';
import { CollectionSizeDatabaseService } from './domain/services/collections-size-database.service';
import { CollectionSizeDatabaseUseCase } from './application/use-cases/collection-size-database.use-case';
import { CollectionsController } from './interfaces/controllers/collections.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CleanupDatabaseController } from './interfaces/controllers/cleanup-records-database.controller';
import { DatabaseBackupModule } from './infrastructure/database/backup-database.module';

const providers = [
  CleanupDatabaseUseCase,
  CollectionSizeDatabaseService,
  CollectionSizeDatabaseUseCase,
  CleanupRecordsDatabaseService,
  CleanupRecordsDatabaseService,
  AppService
]

console.log(__dirname)
@Module({
  imports: [
    DatabaseModule, DatabaseBackupModule
  ],
  controllers: [AppController, CleanupDatabaseController, CollectionsController],
  providers: providers,
})

export class AppModule {}
