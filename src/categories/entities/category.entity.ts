import { Book } from "src/books/entities/book.entity";
import { InterestedCategory } from "src/interested-category/entities/interested-category.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string

    @Column()
    icon:string

    @Column()
    priority:string;

    @OneToMany(() => Book, (book) => book.category)
    books: Book[];

     @OneToMany(() => InterestedCategory, interestedCategory => interestedCategory.category)
  interestedCategories: InterestedCategory[];
}
