import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Max } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsNumber()
    @Max(30)
    @IsNotEmpty()
    age: number;
}