import { Module, Global, Logger } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DATABASE_URI');
        const dbName = configService.get<string>('DATABASE_NAME', 'CoolTool');
        try {
          const client = await MongoClient.connect(uri);
          Logger.log(`Connected to Main DB: ${uri}/${dbName}`, 'ModuleDatabase');
          return client.db(dbName);
        } catch (err) {
          Logger.error('Error connecting to Main Db:', err);
          throw err;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
