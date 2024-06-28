import { IsNumber } from "class-validator";


export class CreateHistoryDto {
  @IsNumber() 
  userId: number;

    @IsNumber() 
  bookId: number;
}