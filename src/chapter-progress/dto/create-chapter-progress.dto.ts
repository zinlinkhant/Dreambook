import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateChapterProgressDto {

  @IsNotEmpty()
  @IsNumber()
  chapterProgress: number;
}
