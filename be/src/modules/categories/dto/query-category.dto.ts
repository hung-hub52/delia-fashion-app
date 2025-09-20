// src/modules/categories/dto/query-category.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryCategoryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ example: 'tui' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiPropertyOptional({ example: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  parent_id?: number;
}
