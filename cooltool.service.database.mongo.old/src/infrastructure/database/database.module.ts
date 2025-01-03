import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/domain/entities/user.entity';

var entities = [
    UserEntity
]

export const DatabaseConfig = [
  ConfigModule.forRoot({
    isGlobal: true, // Makes environment variables globally available
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'sqlite',
      database: configService.get<string>('DATABASE_PATH', 'database.sqlite'), // Get database file from .env
      entities: entities, // Load all entities
      synchronize: true, // Automatically sync schema (disable in production)
    }),
    inject: [ConfigService],
  }),
  TypeOrmModule.forFeature(entities), // Register the UserEntity for DI
];