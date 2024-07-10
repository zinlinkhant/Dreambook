import { Transform } from "class-transformer";
import { IsString } from "class-validator";


export class CreateHistoryDto {

  @IsString() 
   @Transform(({ value }) => String(value))
  bookSlug: string;
}