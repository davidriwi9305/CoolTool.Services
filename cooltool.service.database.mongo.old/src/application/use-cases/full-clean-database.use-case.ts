import { Injectable } from '@nestjs/common';
import { GeneralDatabaseService } from 'src/domain/services/general-database.service';

@Injectable()
export class FullCleanDatabaseUseCase {
  constructor(
    private readonly generalDatabaseService: GeneralDatabaseService, // Inject domain service
  ) {}

  async execute(): Promise<boolean> {
    await this.generalDatabaseService.fullClean();
    return true;
  }
}