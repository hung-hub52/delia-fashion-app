import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateMeDto {
  @IsOptional()
  @IsString()
  ho_ten?: string;

  @IsOptional()
  @IsString()
  so_dien_thoai?: string;

  @IsOptional()
  @IsString()
  dia_chi?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
