import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

export type SenderRole = 'admin' | 'user';
export type ReadState  = 'chua_doc' | 'da_doc';

@Entity('chat_ho_tro')
@Index(['id_nguoidung', 'thoi_gian'])
export class ChatMessage {
  @PrimaryGeneratedColumn({ name: 'id_chat', type: 'int' })
  id_chat: number;

  @Column({ name: 'id_nguoidung', type: 'int' })
  id_nguoidung: number;

  @Column({ name: 'noi_dung', type: 'text' })
  noi_dung: string;

  @Column({
    name: 'nguoi_gui',
    type: 'enum',
    enum: ['admin', 'user'],
  })
  nguoi_gui: SenderRole;

  // Lưu ý: nếu cột của bạn không có DEFAULT CURRENT_TIMESTAMP,
  // hãy đổi CreateDateColumn -> Column({ type:'datetime' })
  @Column({ name: 'thoi_gian', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
thoi_gian: Date;


  @Column({
    name: 'trang_thai',
    type: 'enum',
    enum: ['chua_doc', 'da_doc'],
    default: 'chua_doc',
  })
  trang_thai: ReadState;
}
