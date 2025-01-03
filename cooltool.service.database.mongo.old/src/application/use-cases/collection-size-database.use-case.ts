import { Injectable } from '@nestjs/common';
import { CollectionSizeDatabaseService } from 'src/domain/services/clean/collections-size-database.service';

@Injectable()
export class CollectionSizeDatabaseUseCase {
  constructor(
    private readonly collectionSizeDatabaseService: CollectionSizeDatabaseService, // Inject domain service
  ) {}

  async execute(): Promise<boolean> {
    await this.collectionSizeDatabaseService.sizes();
    return true;
  }
}