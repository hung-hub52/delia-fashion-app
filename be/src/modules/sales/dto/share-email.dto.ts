import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class ShareEmailDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  subject?: string;       // Tiêu đề email

  @IsOptional()
  @IsString()
  message?: string;       // Nội dung email (cho phép HTML)

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) =>
    value === true || value === 'true' || value === 1 || value === '1',
  )
  sendAll?: boolean;      // true => gửi đến tất cả KH

  @IsOptional()
  @IsArray()
  @IsEmail({}, { each: true })
  emails?: string[];      // danh sách email cụ thể (nếu không sendAll)
}
