import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChapterDto {
  @IsNotEmpty()
  @IsNumber()
  chapterNum: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  priority: number;

  @IsNotEmpty()
  @IsString()
  status: boolean; // Example: 'draft', 'published'
}
