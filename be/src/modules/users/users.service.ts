// src/modules/users/users.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  private findById(id: number) {
    return this.userRepo.findOne({ where: { id_nguoidung: id } as any });
  }

  /* ---- Customers ---- */
  findAllCustomers() {
    return this.userRepo.find({
      where: { vai_tro: 'khachhang' },
      select: ['id_nguoidung', 'ho_ten', 'email', 'so_dien_thoai', 'dia_chi', 'trang_thai'],
      order: { id_nguoidung: 'DESC' },
    });
  }

  async lockUser(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    if (user.vai_tro === 'admin') throw new BadRequestException('Không thể khóa tài khoản admin');
    user.trang_thai = 0;
    await this.userRepo.save(user);
    return { message: 'Đã khóa tài khoản', id: user.id_nguoidung };
  }

  async unlockUser(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    user.trang_thai = 1;
    await this.userRepo.save(user);
    return { message: 'Đã mở khóa tài khoản', id: user.id_nguoidung };
  }

  /* ---- Me profile ---- */
  async getMe(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User không tồn tại');
    return {
      id_nguoidung: user.id_nguoidung,
      ho_ten: user.ho_ten ?? (user as any)['name'],
      email: user.email,
      vai_tro: user.vai_tro,
      so_dien_thoai: user.so_dien_thoai,
      dia_chi: user.dia_chi,
      anh_dai_dien: user.anh_dai_dien ?? (user as any)['avatar'],
      trang_thai: user.trang_thai,
      created_at: (user as any)['created_at'],
      updated_at: (user as any)['updated_at'],
    };
  }

  async updateMe(userId: number, dto: Partial<Pick<User, 'ho_ten' | 'so_dien_thoai' | 'dia_chi' | 'email'>>) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User không tồn tại');

    const data: Partial<User> = {};
    if (dto.ho_ten?.trim()) data.ho_ten = dto.ho_ten.trim();
    if (dto.so_dien_thoai?.trim()) data.so_dien_thoai = dto.so_dien_thoai.trim();
    if (dto.dia_chi?.trim()) data.dia_chi = dto.dia_chi.trim();

    if (dto.email?.trim()) {
      const newEmail = dto.email.trim().toLowerCase();
      if (newEmail !== user.email) {
        const existed = await this.userRepo.findOne({ where: { email: newEmail, id_nguoidung: Not(userId) } as any });
        if (existed) throw new BadRequestException('Email đã được sử dụng');
        data.email = newEmail;
      }
    }

    if (Object.keys(data).length) {
      await this.userRepo.update({ id_nguoidung: userId } as any, data);
    }
    return { ok: true, user: await this.getMe(userId) };
  }

  async updateAvatar(userId: number, avatarUrl: string) {
    await this.userRepo.update(
      { id_nguoidung: userId } as any,
      { anh_dai_dien: avatarUrl } as any,
    );
    return { ok: true, avatar_url: avatarUrl };
  }
}
