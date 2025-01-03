import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FullCleanDatabaseUseCase } from '../../application/use-cases/full-clean-database.use-case';

@ApiTags('clean-database') // Adds a tag in Swagger for grouping endpoints
@Controller('clean-database')
export class CleanDatabaseController {
  constructor(
    private readonly cleanDatabaseUseCase: FullCleanDatabaseUseCase,
  ) {}

  @Get()
  async getAllUsers(
  ): Promise<boolean> {
    return this.cleanDatabaseUseCase.execute();
  }
}
