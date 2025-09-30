import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chi_tiet_don_hang')
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'id_chi_tiet' })
  id_chi_tiet: number;

  @Column({ name: 'id_don_hang', type: 'int' })
  id_don_hang: number;

  @Column({ name: 'id_san_pham', type: 'int' })
  id_san_pham: number;

  @Column({ name: 'so_luong', type: 'int' })
  so_luong: number;

  @Column({ name: 'don_gia', type: 'decimal', precision: 10, scale: 2 })
  don_gia: number;

  @Column({ name: 'ghi_chu', length: 10, nullable: true })
  ghi_chu?: string;

  @Column({ name: 'tong_tien', type: 'decimal', precision: 10, scale: 2, nullable: true })
  tong_tien?: number;
}
