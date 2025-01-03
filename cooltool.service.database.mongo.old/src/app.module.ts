import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './interfaces/controllers/user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { UserDomainService } from './domain/services/user-domain.service';
import { UserEntity } from './domain/entities/user.entity';
import { DatabaseConfig } from './infrastructure/database/database.module';

const providers = [
  UserDomainService,
  CreateUserUseCase, 
  UserRepository, 
  AppService
]
console.log(__dirname)
@Module({
  imports: [
    ...DatabaseConfig, // Spread the imported configuration
  ],
  controllers: [AppController, UserController],
  providers: providers,
})

export class AppModule {}
