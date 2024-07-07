import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
export class UpdateCommentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;
}