import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { SendMessageDto } from './dto/send-message.dto';

const SYS_END = '[SYSTEM]SESSION_ENDED';

@Injectable()
export class ChatSupportService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly repo: Repository<ChatMessage>,
  ) {}

  /** ========== THREADS LIST (gom theo id_nguoidung) ========== */
  async listThreads() {
    // Mỗi khách 1 dòng + unread + thông tin khách
    const rows = await this.repo.query(`
      SELECT
        t.id_nguoidung AS id,
        MAX(t.thoi_gian) AS updatedAt,
        SUM(CASE WHEN t.nguoi_gui='user' AND t.trang_thai='chua_doc' THEN 1 ELSE 0 END) AS unreadForAdmin,
        u.ho_ten AS customerName,
        u.anh_dai_dien AS customerAvatar
      FROM chat_ho_tro t
      LEFT JOIN nguoi_dung u ON u.id_nguoidung = t.id_nguoidung
      GROUP BY t.id_nguoidung, u.ho_ten, u.anh_dai_dien
      ORDER BY updatedAt DESC
    `);

    // Lấy last message (bỏ qua marker hệ thống)
    const result = await Promise.all(
      rows.map(async (r: any) => {
        const lastRow = await this.repo.query(
          `SELECT id_chat, noi_dung, nguoi_gui, thoi_gian
           FROM chat_ho_tro
           WHERE id_nguoidung = ? AND noi_dung <> ?
           ORDER BY thoi_gian DESC
           LIMIT 1`,
          [r.id, SYS_END],
        );
        const last = lastRow?.[0]
          ? {
              id: lastRow[0].id_chat,
              text: lastRow[0].noi_dung,
              senderRole: lastRow[0].nguoi_gui,
              ts: new Date(lastRow[0].thoi_gian).getTime(),
            }
          : null;

        return {
          id: Number(r.id),
          customerName: r.customerName || null,
          customerAvatar: r.customerAvatar || null,
          updatedAt: r.updatedAt ? new Date(r.updatedAt).getTime() : null,
          unreadForAdmin: Number(r.unreadForAdmin || 0),
          last,
        };
      }),
    );

    return result;
  }

  /** ========== Tạo thread (xác nhận id khách) ========== */
  async createThread(customerId: number) {
    return { id: customerId };
  }

  /** ========== Lấy messages của thread ========== */
  async getMessages(userId: number, limit = 50, beforeTs?: number) {
    // Nếu đang có marker kết thúc, trả về 1 system message
    const latest = await this.repo
      .createQueryBuilder('m')
      .where('m.id_nguoidung = :uid', { uid: userId })
      .orderBy('m.thoi_gian', 'DESC')
      .limit(1)
      .getOne();

    if (latest?.noi_dung === SYS_END) {
      return [
        {
          id: 'sys-end',
          senderRole: 'system',
          text: 'Phiên hỗ trợ khách hàng hiện tại đã kết thúc!',
          ts: Date.now(),
          system: true,
        },
      ];
    }

    // Lấy lịch sử bình thường (bỏ marker nếu có)
    const qb = this.repo
      .createQueryBuilder('m')
      .where('m.id_nguoidung = :uid', { uid: userId })
      .andWhere('m.noi_dung <> :sys', { sys: SYS_END });

    if (beforeTs) {
      qb.andWhere('m.thoi_gian < :bt', { bt: new Date(Number(beforeTs)) });
    }

    const rows = await qb
      .orderBy('m.thoi_gian', 'DESC')
      .limit(Math.min(200, Math.max(1, Number(limit))))
      .getMany();

    // FE mong thứ tự tăng dần
    return rows.reverse().map((r) => ({
      id: r.id_chat,
      senderRole: r.nguoi_gui,
      text: r.noi_dung,
      ts: r.thoi_gian instanceof Date ? r.thoi_gian.getTime() : new Date(r.thoi_gian).getTime(),
    }));
  }

  /** Lấy tên + avatar admin */
  async getSupportMeta() {
    const rows = await this.repo.query(`
      SELECT id_nguoidung AS id, ho_ten AS name, anh_dai_dien AS avatar
      FROM nguoi_dung
      WHERE vai_tro = 'admin' AND (trang_thai IS NULL OR trang_thai <> 0)
      ORDER BY id_nguoidung ASC
      LIMIT 1
    `);
    const r = rows?.[0] || {};
    return {
      adminId: r.id ?? null,
      adminName: r.name || 'CSKH',
      adminAvatar: r.avatar || null,
    };
  }

  /** ========== Gửi message ========== */
  async sendMessage(userId: number, dto: SendMessageDto) {
    // Nếu có marker kết thúc => xoá marker, đánh dấu đây là phiên mới
    const marker = await this.repo
      .createQueryBuilder('m')
      .where('m.id_nguoidung = :uid', { uid: userId })
      .andWhere('m.noi_dung = :sys', { sys: SYS_END })
      .getOne();

    let wasNewSession = false;
    if (marker) {
      await this.repo.remove(marker);
      wasNewSession = true;
    }

    const saved = await this.repo.save(
      this.repo.create({
        id_nguoidung: userId,
        noi_dung: dto.text,
        nguoi_gui: dto.senderRole,
        trang_thai: 'chua_doc',
      }),
    );

    // Nếu user khởi động lại cuộc chat → auto chào
    if (dto.senderRole === 'user') {
      const total = await this.repo.count({ where: { id_nguoidung: userId } });
      if (wasNewSession || total === 1 /* chỉ có 1 tin của user */) {
        await this.repo.save(
          this.repo.create({
            id_nguoidung: userId,
            noi_dung: 'Xin chào 👋 CSKH DELIA ELLY đang sẵn sàng hỗ trợ bạn!',
            nguoi_gui: 'admin',
            trang_thai: 'chua_doc',
          }),
        );
      }
    }

    return { id: saved.id_chat };
  }

  /** ========== Kết thúc hỗ trợ: xoá lịch sử + ghi marker hệ thống ========== */
  async endSupport(userId: number) {
  // XÓA TOÀN BỘ tin nhắn của user
  await this.repo
    .createQueryBuilder()
    .delete()
    .from(ChatMessage)
    .where('id_nguoidung = :uid', { uid: userId })
    .execute();

  // KHÔNG chèn thêm message "system" nào vào DB
  return { ok: true, cleared: true };
}

  /** ========== Đánh dấu đã đọc ========== */
  async markReadForAdmin(userId: number) {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ trang_thai: 'da_doc' })
      .where('id_nguoidung = :uid', { uid: userId })
      .andWhere("nguoi_gui = 'user'")
      .andWhere("trang_thai = 'chua_doc'")
      .execute();
    return { ok: true };
  }

  async markReadForUser(userId: number) {
    await this.repo
      .createQueryBuilder()
      .update()
      .set({ trang_thai: 'da_doc' })
      .where('id_nguoidung = :uid', { uid: userId })
      .andWhere("nguoi_gui = 'admin'")
      .andWhere("trang_thai = 'chua_doc'")
      .execute();
    return { ok: true };
  }
}
