import { IsOptional, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;

  @IsOptional()
  @IsNumber()
  bookId?: number;
}