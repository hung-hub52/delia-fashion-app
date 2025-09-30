import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('danh_muc')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id_danh_muc' })
  id_danh_muc: number;

  @Column({ name: 'ten_danh_muc', length: 100 })
  ten_danh_muc: string;

  @Column({ name: 'parent_id', type: 'int', default: 0 })
  parent_id: number;
}
