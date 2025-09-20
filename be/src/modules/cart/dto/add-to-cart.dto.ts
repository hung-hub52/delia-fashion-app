import { IsNumber } from 'class-validator';
export class AddToCartDto {
  @IsNumber() id_san_pham: number;
  @IsNumber() so_luong: number;
}
