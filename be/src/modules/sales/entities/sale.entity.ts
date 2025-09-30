import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('ma_giam_gia')
export class Sale {
  @PrimaryGeneratedColumn({ name: 'id_khuyen_mai' })
  id_khuyen_mai!: number;

  @Column({ name: 'ma_giam_gia', type: 'varchar', length: 100, unique: true })
  ma_giam_gia!: string;

  @Column({ name: 'so_luong', type: 'int', default: 0 })
  so_luong!: number;

  @Column({ name: 'han_su_dung', type: 'date', nullable: true })
  han_su_dung!: Date | null;

  @CreateDateColumn({ name: 'ngay_tao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  ngay_tao!: Date;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  mo_ta!: string | null;

  @Column({ name: 'trang_thai', type: 'varchar', length: 20, default: 'active' })
  trang_thai!: string;
}
