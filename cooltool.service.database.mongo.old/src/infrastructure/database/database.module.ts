import { Module, Global } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const uri =configService.get<string>('DATABASE_URI', 'mongodb://127.0.0.1:29696');
        const dbName = 'CoolTool'; // Replace with your database name

        try {
          console.log("Connecting to Database:", uri);
          const client = await MongoClient.connect(uri);
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
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
