import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpRegisterDto } from './dto/request-otp-register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyAdminDto } from './dto/verify-admin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Gửi OTP đăng ký' })
  @Post('register/request-otp')
  requestOtp(@Body() dto: RequestOtpRegisterDto) {
    return this.authService.requestOtpRegister(dto);
  }

  @ApiOperation({ summary: 'Xác minh OTP & tạo tài khoản' })
  @Post('register/verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtpRegister(dto);
  }

  @ApiOperation({ summary: 'Đăng nhập' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiOperation({ summary: 'Xác thực lại mật khẩu Admin (re-auth)' })
  @Post('verify-admin')
  verifyAdmin(@Body() dto: VerifyAdminDto ) {
    return this.authService.verifyAdmin(dto);
  }
}
