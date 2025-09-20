import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RequestOtpRegisterDto {
  @IsNotEmpty()
  ho_ten: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  so_dien_thoai?: string;
  dia_chi?: string;
}
