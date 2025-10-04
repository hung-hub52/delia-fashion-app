import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class VerifyForgotOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  otp: string;

  @MinLength(6)
  new_password: string;
}
