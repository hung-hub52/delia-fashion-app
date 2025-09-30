import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Inventory } from './entities/inventory.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { WarehouseService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Inventory])],
  controllers: [ProductsController, InventoryController],
  providers: [ProductsService, WarehouseService],
  exports: [ProductsService, WarehouseService],
})
export class InventoryModule {}
