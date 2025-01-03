import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FullCleanDatabaseUseCase } from './application/use-cases/full-clean-database.use-case';
// import { DatabaseConfig } from './infrastructure/database/database.module';
import { GeneralDatabaseService } from './domain/services/general-database.service';

const providers = [
  FullCleanDatabaseUseCase,
  GeneralDatabaseService,
  AppService
]
console.log(__dirname)
@Module({
  imports: [
    // ...DatabaseConfig, // Spread the imported configuration
  ],
  controllers: [AppController],
  providers: providers,
})

export class AppModule {}
