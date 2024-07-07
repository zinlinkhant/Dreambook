import { IsArray, IsInt, IsString, IsNotEmpty } from 'class-validator';
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

  @IsString()
  status: string;

  @IsInt()
  userId: number;
}
