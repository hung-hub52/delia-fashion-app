import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';

@Index(['ten_san_pham', 'id_danh_muc'])
@Entity('san_pham')
export class Product {
  @PrimaryGeneratedColumn({ name: 'id_san_pham' })
  id_san_pham: number;

  @Column({ name: 'ten_san_pham', type: 'varchar', length: 255 })
  ten_san_pham: string;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  mo_ta?: string;

  @Column({ name: 'gia_ban', type: 'decimal', precision: 12, scale: 2, default: 0 })
  gia_ban: string;

  @Column({ name: 'hinh_anh', type: 'varchar', length: 255, nullable: true })
  hinh_anh?: string; // path ảnh tương đối /uploads/xxx.jpg

  @Column({ name: 'trang_thai', type: 'varchar', length: 50, default: 'active' })
  trang_thai: 'active' | 'inactive';

  @ManyToOne(() => Category, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'id_danh_muc' })
  id_danh_muc: Category;

  // Nếu kho là 1–1 theo sản phẩm
  @OneToOne(() => Inventory, (i) => i.product, { cascade: true, eager: true })
  inventory: Inventory;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
}
