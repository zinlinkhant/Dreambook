import { Transform } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsString,
  IsNotEmpty,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
export class CreateBookDto {

  @IsOptional()
  coverImg: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @Transform(({ obj, key }) => {
    return JSON.parse(obj[key]);
  })
  keywords: string[];

  @IsString()
  status: string;
}
