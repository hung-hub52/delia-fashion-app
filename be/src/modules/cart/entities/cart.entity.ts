import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('gio_hang')
export class Cart {
  @PrimaryGeneratedColumn({ name: 'id_gio_hang' })
  id_gio_hang: number;

  @Column({ name: 'id_nguoidung', type: 'int' })
  id_nguoidung: number;

  @Column({ name: 'ngay_tao', type: 'datetime', nullable: true })
  ngay_tao?: Date;
}
