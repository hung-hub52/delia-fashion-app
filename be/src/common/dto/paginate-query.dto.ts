import { IsInt, IsOptional, IsString, Min, IsIn } from 'class-validator';
export class PaginateQueryDto {
  @IsOptional() @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @IsInt() @Min(1) limit?: number = 10;
  @IsOptional() @IsString() q?: string;        // search name
  @IsOptional() @IsInt() id_danh_muc?: number; // filter by category
  @IsOptional() @IsString() sort?: string;     // "name_asc|name_desc|price_asc|price_desc|created_desc"
  @IsOptional() @IsIn(['active','inactive']) trang_thai?: 'active' | 'inactive';
}
