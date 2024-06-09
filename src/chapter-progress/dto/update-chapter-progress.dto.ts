import { IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateChapterProgressDto {
    @IsOptional()
  @IsNumber()
  bookId?: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  chapterProgress?: number;
}
