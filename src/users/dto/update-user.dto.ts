
import { IsNumber, IsOptional, Max } from 'class-validator';

export class UpdateUserDto{
    @IsNumber()
    @Max(50)
    @IsOptional()
    age: number;

    @IsOptional()
    password: string;
}
