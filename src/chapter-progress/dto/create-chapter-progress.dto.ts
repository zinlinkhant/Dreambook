import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateChapterProgressDto {
    @IsNotEmpty()
  @IsNumber()
  bookId: number;

  // @IsNotEmpty()
  // @IsNumber()
  // userId: number;

  @IsNotEmpty()
  @IsNumber()
  chapterProgress: number;
}
