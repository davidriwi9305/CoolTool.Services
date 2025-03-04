import { Controller, Get, Param  } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CleanupDatabaseUseCase } from '../../application/use-cases/clean-up-database.use-case';

@ApiTags('Collections') // Adds a tag in Swagger for grouping endpoints
@Controller('cleanup-records')
export class CleanupDatabaseController {
  constructor(
    private readonly cleanDatabaseUseCase: CleanupDatabaseUseCase,
  ) {}

  @Get('old-records')
  async oldRecords(
  ): Promise<boolean> {
    return this.cleanDatabaseUseCase.oldRecords();
  }

  @Get('recover/:collection/:backupFileKey')
  async recoverRecords(
    @Param('collection') collection: string, 
    @Param('backupFileKey') backupFileKey: string
  ): Promise<boolean> {
    await this.cleanDatabaseUseCase.recoverRecords(collection, backupFileKey);
    return true;
  }
}
