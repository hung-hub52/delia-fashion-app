import { IsNumber, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString() ten_danh_muc: string;
  @IsNumber() parent_id: number;
}
