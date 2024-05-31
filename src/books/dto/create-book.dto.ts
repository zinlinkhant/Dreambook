export class CreateBookDto {
    coverImg: string;
  title: string;
  description: string;
  categoryId: number;
  keywords: string[];
  status: boolean;
  userId: number;
}
