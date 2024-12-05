import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  @Get()
  getOrders() {
    return [{ id: 1, userId: 1, product: 'Laaaaaptop' }];
  }
}
