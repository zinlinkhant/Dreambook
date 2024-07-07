import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Min(3)
  text: string;

  @IsNotEmpty()
  @IsString()
  bookSlug: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}


