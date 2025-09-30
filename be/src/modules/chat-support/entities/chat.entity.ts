import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('chat_ho_tro')
export class Chat {
  @PrimaryGeneratedColumn({ name: 'id_chat' })
  id_chat: number;

  @Column({ name: 'id_nguoidung', type: 'int' })
  id_nguoidung: number;

  @Column({ name: 'noi_dung', type: 'text' })
  noi_dung: string;

  @Column({ name: 'nguoi_gui', type: 'enum', enum: ['admin','user'] })
  nguoi_gui: 'admin' | 'user';

  @Column({ name: 'thoi_gian', type: 'datetime' })
  thoi_gian: Date;

  @Column({ name: 'trang_thai', type: 'enum', enum: ['chua_doc','da_doc'] })
  trang_thai: 'chua_doc' | 'da_doc';
}
