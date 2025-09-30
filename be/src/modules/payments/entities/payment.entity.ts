import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('thanh_toan')
export class Payment {
  @PrimaryGeneratedColumn({ name: 'id_thanh_toan' })
  id_thanh_toan: number;

  @Column({ name: 'id_don_hang', type: 'int' })
  id_don_hang: number;

  @Column({ name: 'phuong_thuc', type: 'enum', enum: ['tien_mat','chuyen_khoan','vi_dien_tu'] })
  phuong_thuc: 'tien_mat' | 'chuyen_khoan' | 'vi_dien_tu';

  @Column({ name: 'trang_thai', type: 'enum', enum: ['cho_xu_ly','da_thanh_toan','that_bai'] })
  trang_thai: 'cho_xu_ly' | 'da_thanh_toan' | 'that_bai';

  @Column({ name: 'thoi_gian_thanh_toan', type: 'datetime', nullable: true })
  thoi_gian_thanh_toan?: Date;

  @Column({ name: 'tong_tien', type: 'decimal', precision: 10, scale: 2 })
  tong_tien: number;
}
