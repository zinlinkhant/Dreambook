import { IsNotEmpty } from "class-validator";

export class CreateInterestedCategoryDto {
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  categoryIds: number[];
}