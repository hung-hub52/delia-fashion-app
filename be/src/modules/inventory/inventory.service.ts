
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class WarehouseService {
  [x: string]: any;
  constructor(
    @InjectRepository(Inventory) private readonly invRepo: Repository<Inventory>,
  ) {}

  async initDefaultForProduct(product: Product, qty = 0, khoName = 'Kho mặc định') {
    const existed = await this.invRepo.findOne({ where: { id_san_pham: product.id_san_pham } });

    if (existed) {
      existed.ten_san_pham     = product.ten_san_pham;
      existed.ten_nha_kho      = existed.ten_nha_kho || khoName;
      // so_luong_nhap đại diện cho "số lượng nhập gần nhất" theo yêu cầu
      existed.so_luong_nhap    = qty ?? 0;
      existed.so_luong_ton_kho = (existed.so_luong_ton_kho ?? 0) + (qty ?? 0);
      // không cập nhật created_at để giữ thời điểm nhập ban đầu
      const savedInv = await this.invRepo.save(existed);
      // Cập nhật created_at để thể hiện lần nhập gần nhất
      // Lưu ý: nếu muốn giữ lần tạo ban đầu, nên có cột updated_at riêng.
      // Đồng bộ tồn kho trên bảng sản phẩm để FE đọc được
      const prodRepo = this.invRepo.manager.getRepository(Product);
      const prod = await prodRepo.findOne({ where: { id_san_pham: product.id_san_pham } });
      if (prod) {
        prod.so_luong_nhap = (prod.so_luong_nhap ?? 0) + (qty ?? 0);
        prod.so_luong_ton = (prod.so_luong_ton ?? 0) + (qty ?? 0);
        await prodRepo.save(prod);
      }
      return savedInv;
    }

    const row: Partial<Inventory> = {
      id_san_pham: product.id_san_pham,
      ten_san_pham: product.ten_san_pham,
      ten_nha_kho: khoName || 'Kho mặc định',
      so_luong_nhap: qty ?? 0,
      so_luong_ton_kho: qty ?? 0,
    };
    const newInv = await this.invRepo.save(row as Inventory);
    // created_at của bản ghi mới đã phản ánh thời điểm nhập
    // Đồng bộ tồn kho trên bảng sản phẩm để FE đọc được
    const prodRepo = this.invRepo.manager.getRepository(Product);
    const prod = await prodRepo.findOne({ where: { id_san_pham: product.id_san_pham } });
    if (prod) {
      prod.so_luong_nhap = (prod.so_luong_nhap ?? 0) + (qty ?? 0);
      prod.so_luong_ton = (prod.so_luong_ton ?? 0) + (qty ?? 0);
      await prodRepo.save(prod);
    }
    return newInv;
  }

  async initForProduct(productId: number, qty = 0, khoName = 'Kho mặc định') {
    const prodRepo = (this.invRepo.manager.getRepository(Product));
    const product = await prodRepo.findOne({ where: { id_san_pham: productId } });
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }
    return this.initDefaultForProduct(product as any, qty, khoName);
  }

  async list(page = 1, limit = 100) {
    const [data, total] = await this.invRepo.findAndCount({
      order: { id_san_pham: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  // Trả về lịch sử nhập chi tiết theo từng lần nhập
  async history(page = 1, limit = 100) {
    const [data, total] = await this.invRepo.findAndCount({
      order: { id_san_pham: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    // Trả từng bản ghi inventory như một lần nhập (vì chỉ giữ created_at)
    const logs = data.map((i) => ({
      productId: i.id_san_pham,
      name: i.ten_san_pham,
      qty: i.so_luong_nhap ?? 0,
      branch: i.ten_nha_kho,
      date: i.created_at,
    }));
    return { data: logs, total, page, limit };
  }
}
