import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    title:string;

    @IsNotEmpty()
    @IsString()
    icon:string;


    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    priority: string;
}
