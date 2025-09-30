// src/modules/auth/auth.service.ts
import {
  Injectable, BadRequestException, UnauthorizedException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from '../users/entities/user.entity';
import { OtpRequest } from './entities/otp.entity';
import { RequestOtpRegisterDto } from './dto/request-otp-register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyAdminDto } from './dto/verify-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(OtpRequest) private readonly otpRepo: Repository<OtpRequest>,
    private readonly jwtService: JwtService,
    private readonly mailer: MailerService,
  ) {}

  /* -------- REGISTER VIA OTP -------- */
  async requestOtpRegister(dto: RequestOtpRegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const existed = await this.userRepo.findOne({ where: { email } });
    if (existed) throw new BadRequestException('Email đã tồn tại');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpRepo.delete({ email } as any);
    const hashed = await bcrypt.hash(dto.password, 10);

    const rec = this.otpRepo.create({
      email, otp, password: hashed, ho_ten: dto.ho_ten,
      so_dien_thoai: dto.so_dien_thoai, dia_chi: dto.dia_chi,
      created_at: new Date(), expires_at: expires,
    } as Partial<OtpRequest>);
    await this.otpRepo.save(rec);

    try {
      await this.mailer.sendMail({
        to: email, subject: 'Xác minh tài khoản - DELIASHOP',
        html: `<p>Mã OTP: <b>${otp}</b> (hết hạn sau 5 phút)</p>`,
      });
    } catch {}
    return { message: 'Đã gửi OTP' };
  }

  async verifyOtpRegister(dto: VerifyOtpDto) {
    const email = dto.email.trim().toLowerCase();
    const rec = await this.otpRepo.findOne({ where: { email } });
    if (!rec) throw new NotFoundException('Không tìm thấy yêu cầu OTP');
    if (rec.expires_at < new Date()) throw new BadRequestException('OTP đã hết hạn');
    if (rec.otp !== dto.otp) throw new BadRequestException('OTP không đúng');

    const existed = await this.userRepo.findOne({ where: { email } });
    if (existed) throw new BadRequestException('Email đã tồn tại');

    const user = await this.userRepo.save(
      this.userRepo.create({
        ho_ten: rec.ho_ten, email: rec.email, password: rec.password,
        vai_tro: 'khachhang', trang_thai: 1, so_dien_thoai: rec.so_dien_thoai, dia_chi: rec.dia_chi,
      } as Partial<User>),
    );
    await this.otpRepo.delete({ id: rec.id } as any);

    const payload = { sub: user.id_nguoidung, role: user.vai_tro, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    const { password, ...safeUser } = user as any;
    return { message: 'Xác minh thành công', access_token, user: safeUser };
  }

  /* -------- LOGIN -------- */
  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu');
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Sai email hoặc mật khẩu');
    if (user.trang_thai === 0) throw new UnauthorizedException('Tài khoản đã bị khoá');

    const payload = { sub: user.id_nguoidung, role: user.vai_tro, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
    const { password, ...safeUser } = user as any;
    return { access_token, user: safeUser };
  }

  /* -------- VERIFY ADMIN (RE-AUTH) -------- */
  async verifyAdminPassword(opts: { userId?: number; email?: string; password: string }): Promise<boolean> {
    let user: User | null = null;
    if (opts.userId != null) {
      user = await this.userRepo.findOne({ where: { id_nguoidung: Number(opts.userId) } as any });
    }
    if (!user && opts.email) {
      user = await this.userRepo.findOne({ where: { email: opts.email.trim().toLowerCase() } });
    }
    if (!user || user.vai_tro !== 'admin' || !user.password) return false;
    return bcrypt.compare(opts.password, user.password);
  }

  /* -------- CHANGE PASSWORD -------- */
  async changePassword(userId: number | string, current_password: string, new_password: string) {
    const user = await this.userRepo.findOne({ where: { id_nguoidung: Number(userId) } as any });
    if (!user?.password) return false;
    const ok = await bcrypt.compare(current_password, user.password);
    if (!ok) return false;
    const hash = await bcrypt.hash(new_password, 10);
    await this.userRepo.update({ id_nguoidung: Number(userId) } as any, { password: hash });
    return true;
  }

  /* (Optional) verify admin theo email — giữ lại nếu cần dùng riêng */
  async verifyAdmin(dto: VerifyAdminDto) {
    const email = dto.email?.trim().toLowerCase();
    if (!email) throw new BadRequestException('Vui lòng cung cấp email admin');
    const admin = await this.userRepo.findOne({ where: { email } });
    if (!admin) throw new NotFoundException('Không tìm thấy tài khoản');
    if ((admin.vai_tro || '').toLowerCase() !== 'admin') {
      throw new UnauthorizedException('Tài khoản này không có quyền admin');
    }
    const ok = await bcrypt.compare(dto.password, admin.password);
    if (!ok) throw new UnauthorizedException('Mật khẩu không đúng');
    return { ok: true, admin_id: admin.id_nguoidung };
  }
}
