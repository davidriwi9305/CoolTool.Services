import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'cooltool.service.database.mongo.old!';
  }
}
