import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  usageLimit?: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  status?: string; // 'active' | 'disabled' | 'pending' cũng được nếu muốn chặt hơn
}
