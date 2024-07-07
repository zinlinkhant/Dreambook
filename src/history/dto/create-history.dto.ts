import { IsNumber } from "class-validator";


export class CreateHistoryDto {

    @IsNumber() 
  bookSlug: string;
}