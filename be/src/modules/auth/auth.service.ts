import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';

import { User } from '../users/entities/user.entity';
import { OtpRequest } from './entities/otp.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { VerifyAdminDto } from './dto/verify-admin.dto';
import { RequestOtpRegisterDto } from './dto/request-otp-register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(OtpRequest) private readonly otpRepo: Repository<OtpRequest>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  // B1: gửi OTP
  async requestOtpRegister(dto: RequestOtpRegisterDto) {
    const existed = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existed) throw new BadRequestException('Email đã tồn tại');

    const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
    const expires = new Date(Date.now() + 10 * 60 * 500); // 5 phút

    const hashedPass = await bcrypt.hash(dto.password, 10);

    await this.otpRepo.delete({ email: dto.email } as any);

    const record = this.otpRepo.create({
      email: dto.email,
      otp,
      password: hashedPass,
      ho_ten: dto.ho_ten,
      so_dien_thoai: dto.so_dien_thoai,
      dia_chi: dto.dia_chi,
      created_at: new Date(),
      expires_at: expires,
    } as Partial<OtpRequest>);
    await this.otpRepo.save(record);

    await this.mailerService.sendMail({
      to: dto.email,
      subject: 'Xác minh tài khoản - DELIASHOP',
      html: `<p>Mã OTP của bạn là: <b>${otp}</b>. Mã này sẽ hết hạn sau 5 phút.</p>`,
    });

    return { message: 'Đã gửi mã OTP xác minh về email của bạn.' };
  }

  // B2: xác thực OTP
  async verifyOtpRegister(dto: VerifyOtpDto) {
    const rec = await this.otpRepo.findOne({ where: { email: dto.email } });
    if (!rec) throw new NotFoundException('Không tìm thấy yêu cầu OTP');
    if (rec.expires_at < new Date()) throw new BadRequestException('OTP đã hết hạn');
    if (rec.otp !== dto.otp) throw new BadRequestException('OTP không đúng');

    const existed = await this.userRepo.findOne({ where: { email: rec.email } });
    if (existed) throw new BadRequestException('Email đã tồn tại');

    const user = this.userRepo.create({
      ho_ten: rec.ho_ten,
      email: rec.email,
      password: rec.password,
      vai_tro: 'khachhang',
      trang_thai: 1,
      so_dien_thoai: rec.so_dien_thoai,
      dia_chi: rec.dia_chi,
    } as Partial<User>);
    const saved = await this.userRepo.save(user);

    await this.otpRepo.delete({ id: rec.id } as any);

    const payload = { sub: saved.id_nguoidung, role: saved.vai_tro, email: saved.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Xác minh thành công',
      access_token: token,
      user: { ...saved, password: undefined },
    };
  }

  // Login
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Sai email hoặc mật khẩu');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Sai email hoặc mật khẩu');

    const payload = { sub: user.id_nguoidung, role: user.vai_tro, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token, user: { ...user, password: undefined } };
  }

  async verifyAdmin(dto: VerifyAdminDto) {
    // Ưu tiên email trong body, nếu không có → dùng ADMIN_EMAIL, nếu không có nữa → tìm user role 'admin'
    const targetEmail =
      dto.email?.trim() ||
      process.env.ADMIN_EMAIL ||
      'admin@gmail.com';

    let admin: User | null = null;

    if (targetEmail) {
      admin = await this.userRepo.findOne({ where: { email: targetEmail } });
    }
    if (!admin) {
      // fallback: lấy user có vai_tro = 'admin'
      admin = await this.userRepo.findOne({ where: { vai_tro: 'admin' } });
    }
    if (!admin) {
      throw new NotFoundException('Không tìm thấy tài khoản admin');
    }

    const ok = await bcrypt.compare(dto.password, admin.password);
    if (!ok) throw new UnauthorizedException('Mật khẩu không đúng');

    return { ok: true, admin_id: admin.id_nguoidung };
  }
}
