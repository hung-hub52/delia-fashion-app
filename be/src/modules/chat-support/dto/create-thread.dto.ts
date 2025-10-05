import { IsInt, Min, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateThreadDto {
  @IsInt() @Min(1)
  customerId: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
}
