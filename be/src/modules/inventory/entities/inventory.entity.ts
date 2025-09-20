import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('quan_ly_kho')
export class Inventory {
  @PrimaryGeneratedColumn({ name: 'id_kho' })
  id_kho: number;

  @OneToOne(() => Product, (p) => p.inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_san_pham' })
  product: Product;

  @Column({ name: 'ten_nha_kho', type: 'varchar', length: 255, default: 'Kho chính' })
  ten_nha_kho: string;

  @Column({ name: 'so_luong_ton_kho', type: 'int', default: 0 })
  so_luong_ton_kho: number;

  @Column({ name: 'so_luong_nhap', type: 'int', default: 0 })
  so_luong_nhap: number;
}
