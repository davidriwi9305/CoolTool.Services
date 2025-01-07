import { Module, Global, Logger } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION_BACKUP',
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_BACKUP_URI', 'mongodb://127.0.0.1:29262');
        const dbName = configService.get<string>('DATABASE_BACKUP_NAME', 'CoolToolBackup');
        try {
          const client = await MongoClient.connect(uri);
          Logger.log(`Connected to Backup DB: ${uri}/${dbName}`, 'ModuleDatabase');
          return client.db(dbName);
        } catch (err) {
          Logger.error('Error connecting to Backup Db:', err);

          throw err;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION_BACKUP'],
})
export class DatabaseBackupModule {}
