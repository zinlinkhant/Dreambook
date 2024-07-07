import { IsArray, IsBoolean, IsInt, IsString, IsNotEmpty } from 'class-validator';
export class CreateBookDto {
  //   coverImg: string;
  // title: string;
  // description: string;
  // categoryId: number;
  // keywords: string[];
  // status: boolean;
  // userId: number;
  @IsString()
  @IsNotEmpty()
  coverImg: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  categoryId: number;

  @IsArray()
  @IsString({ each: true })
  keywords: string[];

  @IsBoolean()
  status: string;

  @IsInt()
  userId: number;
}
