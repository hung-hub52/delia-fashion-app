import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';

import { Sale } from './entities/sale.entity';
import { ShareEmailDto } from './dto/share-email.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { User } from '../users/entities/user.entity';

/* ===== Helpers ngày an toàn ===== */
function toDate(v: any): Date | null {
  if (v == null) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  if (typeof v === 'string') {
    const s = v.trim();
    if (!s || s.startsWith('0000-00-00')) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}
function fmtYMD(v: any): string | null {
  const d = toDate(v);
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale) private readonly repo: Repository<Sale>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly mailer: MailerService,
  ) {}

  private toClient(row: Sale) {
    return {
      id: (row as any).id_khuyen_mai,
      code: (row as any).ma_giam_gia,
      description: row.mo_ta ?? '',
      usageLimit: (row as any).so_luong ?? 0,
      endDate: fmtYMD((row as any).han_su_dung),
      status: row.trang_thai ?? 'active',
      createdAt: fmtYMD((row as any).ngay_tao),
    };
  }

  /* ================ CRUD ================ */
  async list() {
    const rows = await this.repo.find({
      order: { id_khuyen_mai: 'DESC' } as any,
    });
    return rows.map((r) => this.toClient(r));
  }

  async create(body: CreateSaleDto | any) {
    const code = String(body.code ?? body.ma_giam_gia ?? '')
      .trim()
      .toUpperCase();
    if (!code) throw new BadRequestException('Thiếu mã khuyến mãi');

    const existed = await this.repo.findOne({
      where: { ma_giam_gia: code } as any,
    });
    if (existed) throw new BadRequestException('Mã khuyến mãi đã tồn tại');

    const entity = this.repo.create({
      ma_giam_gia: code,
      so_luong: Number(body.usageLimit ?? (body as any).so_luong ?? 0),
      han_su_dung: body.endDate ?? (body as any).han_su_dung ?? null,
      mo_ta: body.description ?? (body as any).mo_ta ?? null,
      trang_thai: 'active',
      // nếu DB không auto ngày tạo, có thể bật dòng dưới:
      // ngay_tao: new Date(),
    } as Partial<Sale>);

    const saved = await this.repo.save(entity);
    return this.toClient(saved);
  }

  async disable(id: number) {
    const row = await this.repo.findOne({
      where: { id_khuyen_mai: id } as any,
    });
    if (!row) throw new NotFoundException('Không tìm thấy mã');

    await this.repo.update(
      { id_khuyen_mai: id } as any,
      { trang_thai: 'disabled' } as any,
    );
    const updated = await this.repo.findOne({
      where: { id_khuyen_mai: id } as any,
    });
    return this.toClient(updated!);
  }

  async apply(id: number) {
    const row = await this.repo.findOne({
      where: { id_khuyen_mai: id } as any,
    });
    if (!row) throw new NotFoundException('Không tìm thấy mã');
    if (row.trang_thai === 'disabled')
      throw new BadRequestException('Mã đã vô hiệu hoá');

    const today = new Date();
    const end = toDate((row as any).han_su_dung);
    if (end && today.getTime() > end.getTime()) {
      throw new BadRequestException('Mã đã hết hạn');
    }
    return { ok: true, message: 'Áp dụng thành công' };
  }

  async remove(id: number) {
    const row = await this.repo.findOne({
      where: { id_khuyen_mai: id } as any,
    });
    if (!row) throw new NotFoundException('Không tìm thấy mã');
    await this.repo.delete({ id_khuyen_mai: id } as any);
    return { ok: true };
  }

  /* ============== Share via Email ============== */
  async shareEmail(id: number, dto: ShareEmailDto) {
    const sale = await this.repo.findOne({
      where: { id_khuyen_mai: id } as any,
    });
    if (!sale) throw new NotFoundException('Không tìm thấy mã khuyến mãi');

    const code = (sale as any).ma_giam_gia;
    const endText = fmtYMD((sale as any).han_su_dung) ?? '(không thiết lập)';
    const subject = (dto.subject ?? `Khuyến mãi ${code}`).trim();
    const msg = (dto.message ?? 'Thông báo khuyến mãi').trim();

    let recipients: string[] = [];

    if (dto.sendAll) {
      // Lấy tất cả email KH hoạt động, có email hợp lệ
      const users = await this.userRepo
        .createQueryBuilder('u')
        .select(['u.email'])
        .where('u.email IS NOT NULL')
        .andWhere("u.email <> ''")
        .andWhere('LOWER(u.vai_tro) = :role', { role: 'khachhang' })
        .andWhere('(u.trang_thai IS NULL OR u.trang_thai <> 0)')
        .getMany();

      recipients = users.map((u) => (u as any).email);
    } else if (Array.isArray(dto.emails)) {
      recipients = dto.emails;
    }

    // Lọc hợp lệ + loại trùng
    recipients = Array.from(
      new Set(
        (recipients || [])
          .map((e) => String(e || '').trim())
          .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
      ),
    );

    if (recipients.length === 0)
      throw new BadRequestException('Danh sách email trống');

    const html = `
      <p>${msg}</p>
      <p><b>Mã:</b> ${code}</p>
      <p><b>Hạn dùng:</b> ${endText}</p>
    `;

    await Promise.allSettled(
      recipients.map((to) =>
        this.mailer.sendMail({
          to,
          subject,
          html,
        }),
      ),
    );

    return { ok: true, sent: recipients.length };
  }
}
