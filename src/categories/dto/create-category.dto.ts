import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateCategoryDto {
    @IsNumber()
    @Min(0)
    @IsNotEmpty()
    priority: string;
}
