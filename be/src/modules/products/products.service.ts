import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginateQueryDto } from '../../common/dto/paginate-query.dto';
import { Category } from '../categories/entities/category.entity';
import { Inventory } from '../inventory/entities/inventory.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
    @InjectRepository(Inventory) private readonly invRepo: Repository<Inventory>,
  ) {}

  async findAll(q: PaginateQueryDto) {
    const { page = 1, limit = 10, q: search, id_danh_muc, sort = 'created_desc' } = q;
    const where: any = {};
    if (search) where.ten_san_pham = ILike(`%${search}%`);
    if (id_danh_muc) where.id_danh_muc = { id_danh_muc };
    const order: any = {};
    switch (sort) {
      case 'name_asc': order.ten_san_pham = 'ASC'; break;
      case 'name_desc': order.ten_san_pham = 'DESC'; break;
      case 'price_asc': order.gia_ban = 'ASC'; break;
      case 'price_desc': order.gia_ban = 'DESC'; break;
        case 'created_asc': order.id_san_pham = 'ASC'; break; // fallback if created_at column not present
      default: order.id_san_pham = 'DESC';
    }
    const [data, total] = await this.repo.findAndCount({
      where, order,
      relations: { id_danh_muc: true },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const item = await this.repo.findOne({ where: { id_san_pham: id }, relations: { id_danh_muc: true } });
    if (!item) throw new NotFoundException('Sản phẩm không tồn tại');
    return item;
  }

  async create(body: CreateProductDto) {
    const cat = await this.catRepo.findOne({ where: { id_danh_muc: body.id_danh_muc } });
    if (!cat) throw new NotFoundException('Danh mục không tồn tại');

    const dup = await this.repo.findOne({ where: { ten_san_pham: body.ten_san_pham, id_danh_muc: { id_danh_muc: body.id_danh_muc } } });
    if (dup) throw new ConflictException('Sản phẩm đã tồn tại trong danh mục này');

    const p = this.repo.create({
      ten_san_pham: body.ten_san_pham,
      id_danh_muc: cat,
      gia_ban: String(body.gia_ban ?? 0),
      gia_nhap: String(body.gia_nhap ?? 0),
      so_luong_ton: body.so_luong_ton ?? 0,
      so_luong_nhap: body.so_luong_nhap ?? 0,
      mo_ta: body.mo_ta,
      hinh_anh: body.hinh_anh,
      trang_thai: body.trang_thai ?? ((body.so_luong_ton ?? 0) > 0 ? 'active' : 'inactive'),
    });
    const saved = await this.repo.save(p);

    // Auto-initialize inventory if requested or if initial quantities are provided
    const shouldInitInventory = Boolean(body.khoi_tao_kho) || (Number(body.so_luong_ton ?? 0) > 0 || Number(body.so_luong_nhap ?? 0) > 0);
    if (shouldInitInventory) {
      const qty = Number((body.so_luong_ton ?? body.so_luong_nhap ?? 0) || 0);
      const khoName = (body as any).ten_nha_kho || 'Kho mặc định';

      const existed = await this.invRepo.findOne({ where: { id_san_pham: saved.id_san_pham } });
      if (existed) {
        existed.ten_san_pham = saved.ten_san_pham;
        existed.ten_nha_kho = existed.ten_nha_kho || khoName;
        existed.so_luong_nhap = (existed.so_luong_nhap ?? 0) + qty;
        existed.so_luong_ton_kho = (existed.so_luong_ton_kho ?? 0) + qty;
        await this.invRepo.save(existed);
      } else {
        const row: Partial<Inventory> = {
          id_san_pham: saved.id_san_pham,
          ten_san_pham: saved.ten_san_pham,
          ten_nha_kho: khoName,
          so_luong_nhap: qty,
          so_luong_ton_kho: qty,
        };
        await this.invRepo.save(row as Inventory);
      }
    }

    return this.findOne(saved.id_san_pham);
  }

  async update(id: number, body: UpdateProductDto) {
    const p = await this.findOne(id);
    if (body.id_danh_muc) {
      const cat = await this.catRepo.findOne({ where: { id_danh_muc: body.id_danh_muc } });
      if (!cat) throw new NotFoundException('Danh mục không tồn tại');
      (p as any).id_danh_muc = cat;
    }
    if (body.ten_san_pham !== undefined) p.ten_san_pham = body.ten_san_pham;
    if (body.gia_ban !== undefined) p.gia_ban = String(body.gia_ban);
    if (body.gia_nhap !== undefined) p.gia_nhap = String(body.gia_nhap);
    if (body.so_luong_ton !== undefined) p.so_luong_ton = body.so_luong_ton;
    if (body.so_luong_nhap !== undefined) p.so_luong_nhap = body.so_luong_nhap;
    if (body.mo_ta !== undefined) p.mo_ta = body.mo_ta;
    if (body.hinh_anh !== undefined) p.hinh_anh = body.hinh_anh;
    if (body.trang_thai !== undefined) p.trang_thai = body.trang_thai;
    await this.repo.save(p);
    return this.findOne(id);
  }

  async remove(id: number) {
    const p = await this.findOne(id);
    await this.repo.remove(p);
    return { success: true };
  }
}
