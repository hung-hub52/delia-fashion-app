import { IsInt, IsNotEmpty, IsNumberString, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  ten_san_pham: string;

  @IsOptional() @IsString()
  mo_ta?: string;

  @IsNotEmpty() @IsNumberString()
  gia_ban: string; // "199000.00"

  @IsInt()
  id_danh_muc: number;

  @IsOptional() @IsIn(['active', 'inactive'])
  trang_thai?: 'active' | 'inactive';

  // inventory
  @IsOptional() @IsInt()
  so_luong_ton_kho?: number;

  @IsOptional() @IsInt()
  so_luong_nhap?: number;
}
