import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { UserDomainService } from '../../domain/services/user-domain.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userDomainService: UserDomainService, // Inject domain service
  ) {}

  async execute(name: string, email: string): Promise<UserEntity> {
    const user = new UserEntity();
    user.name = name;
    user.email = email;

    // Use the domain service to validate the user
    await this.userDomainService.validateUser(user);

    // Save the user if validation passes
    return this.userRepository.save(user);
  }
}
