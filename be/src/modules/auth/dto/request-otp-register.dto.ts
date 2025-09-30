// src/modules/auth/dto/request-otp-register.dto.ts
import { IsEmail, IsOptional, IsString } from 'class-validator';
export class RequestOtpRegisterDto {
  @IsString() ho_ten!: string;
  @IsEmail()  email!: string;
  @IsString() password!: string;
  @IsOptional() @IsString() so_dien_thoai?: string;
  @IsOptional() @IsString() dia_chi?: string;
}