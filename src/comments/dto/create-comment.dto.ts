import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @Min(3)
  text: string;

  @IsNotEmpty()
  @IsNumber()
  bookId: number;
}


