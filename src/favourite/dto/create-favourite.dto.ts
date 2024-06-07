import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateFavouriteDto {
    @IsNotEmpty()
    @IsNumber()
    bookId: number;
}
