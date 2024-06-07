import { IsOptional, IsNotEmpty, IsNumber, IsString, IsBoolean } from 'class-validator';

export class UpdateChapterDto {
  @IsOptional()
  @IsNumber()
  chapterNum?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;

  @IsOptional()
  @IsNumber()
  priority?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean; // Assuming status is a boolean, if it's a string ('draft', 'published'), use IsString()
}
