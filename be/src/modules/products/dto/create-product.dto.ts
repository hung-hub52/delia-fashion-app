import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  ten_san_pham: string;

  @IsInt() @Min(1)
  id_danh_muc: number;

  @IsNumber() @Min(0)
  gia_ban: number;

  @IsNumber() @Min(0)
  gia_nhap: number;

  @IsOptional() @IsInt() @Min(0)
  so_luong_ton?: number;

  @IsOptional() @IsInt() @Min(0)
  so_luong_nhap?: number;

  @IsOptional() @IsString()
  mo_ta?: string;

  @IsOptional() @IsString()
  hinh_anh?: string;

  @IsOptional() @IsString()
  trang_thai?: 'active' | 'inactive';

   // ====== Khi tick "Khởi tạo kho" ======
   @IsBoolean() @IsOptional()
   khoi_tao_kho?: boolean;
 
   @IsString() @IsOptional()
   ten_nha_kho?: string; // mặc định "Kho mặc định"
 
}
