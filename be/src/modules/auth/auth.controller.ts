// src/modules/auth/auth.controller.ts
import {
  Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpRegisterDto } from './dto/request-otp-register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyAdminDto } from './dto/verify-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiOperation({ summary: 'Gửi OTP đăng ký' })
  @Post('register/request-otp')
  requestOtp(@Body() dto: RequestOtpRegisterDto) {
    return this.auth.requestOtpRegister(dto);
  }

  @ApiOperation({ summary: 'Xác minh OTP & tạo tài khoản' })
  @Post('register/verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtpRegister(dto);
  }

  @ApiOperation({ summary: 'Đăng nhập' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @ApiOperation({ summary: 'Xác thực lại mật khẩu Admin (re-auth)' })
  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post('verify-admin')
  async verifyAdmin(@Req() req: any, @Body() dto: VerifyAdminDto) {
    const userId = req.user?.sub ?? req.user?.id ?? req.user?.userId ?? req.user?.id_nguoidung;
    const ok = await this.auth.verifyAdminPassword({ userId, password: dto.password });
    if (!ok) throw new HttpException('Mật khẩu admin không đúng.', HttpStatus.UNAUTHORIZED);
    return { ok: true };
  }

  @ApiOperation({ summary: 'Đổi mật khẩu (cần JWT)' })
  @ApiBearerAuth() @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const userId = req.user?.sub ?? req.user?.id ?? req.user?.userId;
    const ok = await this.auth.changePassword(userId, dto.current_password, dto.new_password);
    if (!ok) throw new HttpException('Đổi mật khẩu thất bại', HttpStatus.BAD_REQUEST);
    return { ok: true };
  }
}
