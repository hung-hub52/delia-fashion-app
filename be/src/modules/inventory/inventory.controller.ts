import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WarehouseService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: WarehouseService) {}

  @Post('init')
  init(@Body() body: { productId: number; qty?: number; branch?: string }) {
    return this.service.initForProduct(Number(body.productId), Number(body.qty || 0), body.branch || 'Kho mặc định');
  }

  @Get()
  list(@Query('page') page = 1, @Query('limit') limit = 100) {
    return this.service.list(+page, +limit);
  }

  @Get('history')
  history(@Query('page') page = 1, @Query('limit') limit = 100) {
    return this.service.history(+page, +limit);
  }
}


