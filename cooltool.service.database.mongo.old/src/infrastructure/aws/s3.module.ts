import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'S3',
      useFactory: async (configService: ConfigService) => {
        const accessKeyId = configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = configService.get<string>('AWS_SECRET_ACCESS_KEY');
        const region = configService.get<string>('AWS_REGION', 'us-east-1');
        try {

              return new S3({ 
                  accessKeyId: accessKeyId,
                  secretAccessKey: secretAccessKey,
                  region: region
               });

        } catch (err) {
          Logger.error('Error connecting to S3:', err);
          throw err;
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: ['S3'],
})
export class S3Module {}
