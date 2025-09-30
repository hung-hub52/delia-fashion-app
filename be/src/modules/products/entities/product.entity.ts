// src/modules/products/entities/product.entity.ts
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('san_pham')
export class Product {
  @PrimaryGeneratedColumn({ name: 'id_san_pham' })
  id_san_pham: number;

  @Column({ name: 'ten_san_pham', type: 'varchar', length: 255 })
  ten_san_pham: string;

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_danh_muc' })
  id_danh_muc: Category | any; // giữ kiểu any nếu Category khác tên

  @Column({ name: 'gia_ban', type: 'decimal', precision: 12, scale: 2, default: 0 })
  gia_ban: string;

  @Column({ name: 'gia_nhap', type: 'decimal', precision: 12, scale: 2, default: 0 })
  gia_nhap: string;

  @Column({ name: 'so_luong_ton', type: 'int', default: 0 })
  so_luong_ton: number;

  @Column({ name: 'so_luong_nhap', type: 'int', default: 0 })
  so_luong_nhap: number;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  mo_ta?: string;

  @Column({ name: 'hinh_anh', type: 'varchar', length: 255, nullable: true })
  hinh_anh?: string;

  // active/inactive
  @Column({ name: 'trang_thai', type: 'varchar', length: 20, default: 'active' })
  trang_thai: string;

  // Lưu ý: bảng san_pham hiện không có cột created_at/updated_at
}
