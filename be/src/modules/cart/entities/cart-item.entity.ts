import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chi_tiet_gio_hang')
export class CartItem {
  @PrimaryGeneratedColumn({ name: 'id_chi_tiet' })
  id_chi_tiet: number;

  @Column({ name: 'id_gio_hang', type: 'int' })
  id_gio_hang: number;

  @Column({ name: 'id_san_pham', type: 'int' })
  id_san_pham: number;

  @Column({ name: 'so_luong', type: 'int' })
  so_luong: number;
}
