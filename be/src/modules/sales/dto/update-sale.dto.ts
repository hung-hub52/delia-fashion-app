// src/modules/sales/dto/update-sale.dto.ts
import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSaleDto {
  @IsInt() @Min(0) @IsOptional()
  so_luong?: number;

  @IsDateString() @IsOptional()
  han_su_dung?: string;

  @IsString() @IsOptional()
  mo_ta?: string;
}
