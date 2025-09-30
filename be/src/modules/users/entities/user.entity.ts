import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('nguoi_dung')
export class User {
  @PrimaryGeneratedColumn({ name: 'id_nguoidung' })
  id_nguoidung: number;

  @Column({ name: 'ho_ten', length: 50 })
  ho_ten: string;

  @Column({ name: 'email', length: 100, unique: true })
  email: string;

  @Column({ name: 'password', length: 255 })
  password: string;

  @Column({
    name: 'vai_tro',
    type: 'enum',
    enum: ['admin','khachhang'],
    default: 'khachhang',
  })
  vai_tro: 'admin' | 'khachhang';

  @Column({ name: 'trang_thai', type: 'tinyint', default: 1 })
  trang_thai: number;

  @Column({ name: 'so_dien_thoai', length: 25, nullable: true })
  so_dien_thoai?: string;

  @Column({ name: 'anh_dai_dien', length: 255, nullable: true })
  anh_dai_dien?: string;

  @Column({ name: 'dia_chi', length: 255, nullable: true })
  dia_chi?: string;
}
