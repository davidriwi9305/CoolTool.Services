import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserDomainService {
  async validateUser(user: UserEntity): Promise<void> {
    const errors = await validate(user);
    console.log(errors)
    if (errors.length > 0) {
      throw new Error(
        `Validation failed! Errors: ${errors
          .map((error) => Object.values(error.constraints).join(', '))
          .join('; ')}`,
      );
    }
  }
}
