import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollectionSizeDatabaseUseCase } from 'src/application/use-cases/collection-size-database.use-case';

@ApiTags('Collections') // Adds a tag in Swagger for grouping endpoints
@Controller('collections')
export class CollectionsController {
  constructor(
    private readonly collectionSizeDatabaseUseCase: CollectionSizeDatabaseUseCase,
  ) {}

  @Get('size')
  async getSize(
  ): Promise<boolean> {
    return this.collectionSizeDatabaseUseCase.execute();
  }
}
