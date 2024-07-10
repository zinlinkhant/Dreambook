import { IsNotEmpty } from "class-validator";

export class CreateInterestedCategoryDto {

  @IsNotEmpty()
  categoryIds: number[];
}