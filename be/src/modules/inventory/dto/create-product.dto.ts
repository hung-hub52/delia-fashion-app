import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString() ten_san_pham: string;
  @IsNumber() id_danh_muc: number;
  @IsNumber() gia_ban: number;
  @IsOptional() @IsNumber() gia_nhap?: number;
  @IsOptional() @IsString() mo_ta?: string;
  @IsOptional() @IsString() hinh_anh?: string;
  @IsOptional() @IsNumber() so_luong_nhap?: number;
  @IsOptional() @IsNumber() so_luong_ton?: number;
  @IsOptional() @IsNumber() id_kho?: number;
  @IsOptional() @IsString() trang_thai?: string;
}
