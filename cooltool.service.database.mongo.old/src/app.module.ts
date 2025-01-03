import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FullCleanDatabaseUseCase } from './application/use-cases/full-clean-database.use-case';
import { GeneralDatabaseService } from './domain/services/general-database.service';
import { CleanDatabaseController } from './interfaces/controllers/clean-database.controller';
import { CollectionSizeDatabaseService } from './domain/services/clean/collections-size-database.service';
import { CollectionSizeDatabaseUseCase } from './application/use-cases/collection-size-database.use-case';
import { CollectionsController } from './interfaces/controllers/collections.controller';
import { DatabaseModule } from './infrastructure/database/database.module';

const providers = [
  FullCleanDatabaseUseCase,
  CollectionSizeDatabaseService,
  CollectionSizeDatabaseUseCase,
  GeneralDatabaseService,
  AppService
]
console.log(__dirname)
@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [AppController, CleanDatabaseController, CollectionsController],
  providers: providers,
})

export class AppModule {}
