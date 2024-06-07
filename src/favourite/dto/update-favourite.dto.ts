import { PartialType } from '@nestjs/mapped-types';
import { CreateFavouriteDto } from './create-favourite.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFavouriteDto extends PartialType(CreateFavouriteDto) {
    @IsNotEmpty()
    @IsNumber()
    bookId: number;
}
