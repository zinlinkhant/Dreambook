import { Book } from "src/books/entities/book.entity";
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
}
