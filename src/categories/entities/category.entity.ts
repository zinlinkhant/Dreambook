import { Book } from "src/books/entities/book.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

     @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
