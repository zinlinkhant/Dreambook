import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
    @Transform(({ value }) => String(value))
  text: string;

  @IsNotEmpty()
  @IsString()
  bookSlug: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;
}


