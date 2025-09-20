import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Inventory } from './inventory.entity';

@Entity('san_pham')
export class Product {
  @PrimaryGeneratedColumn({ name: 'id_san_pham' })
  id_san_pham: number;

  @Column({ name: 'ten_san_pham', length: 255 })
  ten_san_pham: string;

  @Column({ name: 'id_danh_muc', type: 'int' })
  id_danh_muc: number;

  @Column({ name: 'gia_ban', type: 'decimal', precision: 10, scale: 2 })
  gia_ban: number;

  @Column({ name: 'gia_nhap', type: 'decimal', precision: 10, scale: 2, nullable: true })
  gia_nhap?: number;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  mo_ta?: string;

  @Column({ name: 'hinh_anh', length: 255, nullable: true })
  hinh_anh?: string;

  @Column({ name: 'so_luong_nhap', type: 'int', nullable: true })
  so_luong_nhap?: number;

  @Column({ name: 'so_luong_ton', type: 'int', nullable: true })
  so_luong_ton?: number;

  @Column({ name: 'id_kho', type: 'int', nullable: true })
  id_kho?: number;

  @Column({ name: 'trang_thai', length: 255, nullable: true })
  trang_thai?: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'id_danh_muc' })
  danh_muc: Category;

  @ManyToOne(() => Inventory)
  @JoinColumn({ name: 'id_kho' })
  kho: Inventory;
}
