import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { UserEntity } from 'src/domain/entities/user.entity';

@ApiTags('users') // Adds a tag in Swagger for grouping endpoints
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly userRepository: UserRepository
  ) {}

  @Post()
  @ApiBody({
    description: 'Data required to create a new user',
    type: CreateUserDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.createUserUseCase.execute(createUserDto.name, createUserDto.email);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userRepository.findById(id);
  }

  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Pagination<UserEntity>> {
    const options: IPaginationOptions = {
      page,
      limit,
      route: '/users',
    };
    return this.userRepository.findAllWithPagination(options);
  }
}
