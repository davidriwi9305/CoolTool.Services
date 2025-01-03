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
        // const uri = 'mongodb://127.0.0.1:29843/CoolTool';//configService.get<string>('DATABASE_URI', 'mongodb://localhost:27017/CoolTool');
        const uri = 'mongodb://127.0.0.1:29843'; // MongoDB connection string
        const dbName = 'CoolTool'; // Replace with your database name

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
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}
