import { IsNotEmpty } from "class-validator";

export class CreateFavouriteDto {
    @IsNotEmpty()
    bookId: number;
}
