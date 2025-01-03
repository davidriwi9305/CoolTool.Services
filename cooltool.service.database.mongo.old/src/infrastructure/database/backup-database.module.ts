import { Module, Global } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION_BACKUP',
      useFactory: async (configService: ConfigService) => {
        const uri =configService.get<string>('DATABASE_URI', 'mongodb://127.0.0.1:29843');
        const dbName = 'CoolToolBackup'; // Replace with your database name

        try {
          console.log("Connecting to Database:", uri);
          const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
          console.log("Connected to MongoDB");
          return client.db(dbName);
        } catch (err) {
            console.error("Error connecting to MongoDB:", err);
            throw err; // Rethrow the error so the caller can handle it
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['DATABASE_CONNECTION_BACKUP'],
})
export class DatabaseBackupModule {}