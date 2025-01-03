import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class CollectionSizeDatabaseService {
  constructor(@Inject('DATABASE_CONNECTION') private readonly db: any) {}

  async sizes(): Promise<void> {
    console.log("Im Hereeeee")
    console.log(this.db)
    const data = await this.db.collection('UserInfo').find().toArray(); // Query the collection
    console.log({data})
    return
  }
}
