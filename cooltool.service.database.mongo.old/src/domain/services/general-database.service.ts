import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class GeneralDatabaseService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: any) {}

  async fullClean(): Promise<void> {
     var data = this.db.collection('users').find().toArray();
    console.log({data})
  }
}
