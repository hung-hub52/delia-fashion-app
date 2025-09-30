import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEmail, MinLength } from 'class-validator';

export class VerifyAdminDto {
  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string; // nếu không gửi thì sẽ dùng ADMIN_EMAIL hoặc tìm theo vai_tro='admin'

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
