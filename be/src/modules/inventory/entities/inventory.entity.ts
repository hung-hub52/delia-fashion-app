import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('quan_ly_kho')
export class Inventory {
  @PrimaryColumn({ name: 'id_san_pham', type: 'int' })
  id_san_pham: number;

  @Column({ name: 'ten_san_pham', type: 'varchar', length: 255 })
  ten_san_pham: string;

  @Column({ name: 'ten_nha_kho', type: 'varchar', length: 255, default: 'Kho chính' })
  ten_nha_kho: string;

  @Column({ name: 'so_luong_ton_kho', type: 'int', default: 0 })
  so_luong_ton_kho: number;

  @Column({ name: 'so_luong_nhap', type: 'int', default: 0 })
  so_luong_nhap: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', update: false })
  created_at: Date;
}
