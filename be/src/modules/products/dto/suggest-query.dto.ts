// be/src/modules/products/dto/suggest-query.dto.ts
import { IsOptional, IsNumberString } from 'class-validator';

export class SuggestQueryDto {
  @IsOptional()
  q?: string;

  @IsOptional()
  @IsNumberString() // "12" hợp lệ; undefined cũng hợp lệ
  limit?: string;
}
