import { IsString, IsOptional, IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class UpdateBookDto {
  @IsString({message:"title should be string"})
  @IsNotEmpty({message:"title should not be empty"})
  title?: string;

  @IsString()
  @IsOptional()
  coverImg?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsNotEmpty()
  categoryId?: number;

  @IsString()
  @IsNotEmpty()
  keywords: string;

  @IsBoolean()
  @IsNotEmpty()
  status?: boolean;
}
