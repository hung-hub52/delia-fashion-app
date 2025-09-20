import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginateQueryDto } from '../../common/dto/paginate-query.dto';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Inventory) private readonly invRepo: Repository<Inventory>,
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
  ) {}

  async findAll(q: PaginateQueryDto) {
    const { page=1, limit=10, q:search, id_danh_muc, sort='created_desc', trang_thai } = q;

    const where: any = {};
    if (search) where.ten_san_pham = ILike(`%${search}%`);
    if (id_danh_muc) where.id_danh_muc = { id_danh_muc };
    if (trang_thai) where.trang_thai = trang_thai;

    const order: any = {};
    switch (sort) {
      case 'name_asc': order.ten_san_pham = 'ASC'; break;
      case 'name_desc': order.ten_san_pham = 'DESC'; break;
      case 'price_asc': order.gia_ban = 'ASC'; break;
      case 'price_desc': order.gia_ban = 'DESC'; break;
      default: order.created_at = 'DESC';
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      order,
      relations: { id_danh_muc: true, inventory: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({
      where: { id_san_pham: id },
      relations: { id_danh_muc: true, inventory: true },
    });
    if (!item) throw new NotFoundException('Sản phẩm không tồn tại');
    return item;
  }

  async create(body: CreateProductDto, imagePath?: string) {
    const category = await this.catRepo.findOne({ where: { id_danh_muc: body.id_danh_muc } });
    if (!category) throw new NotFoundException('Danh mục không tồn tại');

    const dup = await this.repo.findOne({
      where: { ten_san_pham: body.ten_san_pham, id_danh_muc: { id_danh_muc: body.id_danh_muc } },
    });
    if (dup) throw new ConflictException('Sản phẩm đã tồn tại trong danh mục này');

    const product = this.repo.create({
      ten_san_pham: body.ten_san_pham,
      mo_ta: body.mo_ta,
      gia_ban: body.gia_ban,
      trang_thai: body.trang_thai ?? 'active',
      hinh_anh: imagePath,
      id_danh_muc: category,
    });
    const saved = await this.repo.save(product);

    const inv = this.invRepo.create({
      product: saved,
      so_luong_ton_kho: body.so_luong_ton_kho ?? 0,
      so_luong_nhap: body.so_luong_nhap ?? 0,
    });
    await this.invRepo.save(inv);

    return this.findOne(saved.id_san_pham);
  }

  async update(id: number, body: UpdateProductDto, imagePath?: string) {
    const product = await this.findOne(id);
    if (body.id_danh_muc) {
      const cat = await this.catRepo.findOne({ where: { id_danh_muc: body.id_danh_muc } });
      if (!cat) throw new NotFoundException('Danh mục không tồn tại');
      (product as any).id_danh_muc = cat;
    }
    if (body.ten_san_pham) product.ten_san_pham = body.ten_san_pham;
    if (body.mo_ta !== undefined) product.mo_ta = body.mo_ta;
    if (body.gia_ban) product.gia_ban = body.gia_ban;
    if (body.trang_thai) product.trang_thai = body.trang_thai;
    if (imagePath) product.hinh_anh = imagePath;

    await this.repo.save(product);

    if (product.inventory) {
      if (typeof body.so_luong_ton_kho === 'number') product.inventory.so_luong_ton_kho = body.so_luong_ton_kho;
      if (typeof body.so_luong_nhap === 'number') product.inventory.so_luong_nhap = body.so_luong_nhap;
      await this.invRepo.save(product.inventory);
    }

    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.repo.remove(product);
    return { success: true };
  }
}
