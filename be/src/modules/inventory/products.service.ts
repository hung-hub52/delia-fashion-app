import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  async paginate(page = 1, pageSize = 10, id_danh_muc?: number) {
    const where = id_danh_muc ? { id_danh_muc } : {};
    const [items, total] = await this.repo.findAndCount({
      where, order: { id_san_pham: 'DESC' }, skip: (page - 1) * pageSize, take: pageSize,
    });
    return { items, total, page, pageSize };
  }

  findOne(id: number) { return this.repo.findOne({ where: { id_san_pham: id } }); }
  create(dto: CreateProductDto) { return this.repo.save(this.repo.create(dto)); }
  async update(id: number, dto: UpdateProductDto) {
    await this.repo.update({ id_san_pham: id }, dto);
    return this.findOne(id);
  }
  remove(id: number) { return this.repo.delete({ id_san_pham: id }); }
}
