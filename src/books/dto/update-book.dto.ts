import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsArray } from 'class-validator';

export class UpdateBookDto {
  @IsString({message:"title should be string"})
  @IsOptional({message:"title should not be empty"})
  title?: string;

  @IsString()
  @IsOptional()
  coverImg?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ obj, key }) => {
    console.log('ho')
    console.log(typeof JSON.parse(obj[key]))
    return JSON.parse(obj[key]);
  })
  keywords?: string[];

  @IsString()
  @IsOptional()
  status?: string;
}
