import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('quan_ly_kho_history')
export class InventoryLog {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'id_san_pham', type: 'int' })
  id_san_pham: number;

  @Column({ name: 'ten_san_pham', type: 'varchar', length: 255 })
  ten_san_pham: string;

  @Column({ name: 'ten_nha_kho', type: 'varchar', length: 255, default: 'Kho mặc định' })
  ten_nha_kho: string;

  @Column({ name: 'so_luong_nhap', type: 'int', default: 0 })
  so_luong_nhap: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}


