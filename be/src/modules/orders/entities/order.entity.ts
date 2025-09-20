import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('don_hang')
export class Order {
  @PrimaryGeneratedColumn({ name: 'id_don_hang' })
  id_don_hang: number;

  @Column({ name: 'id_nguoi_dung', type: 'int' })
  id_nguoi_dung: number;

  @Column({ name: 'ten_nguoi_nhan', length: 255 })
  ten_nguoi_nhan: string;

  @Column({ name: 'dia_chi_giao', type: 'text' })
  dia_chi_giao: string;

  @Column({ name: 'trang_thai', length: 255 })
  trang_thai: string;
}
