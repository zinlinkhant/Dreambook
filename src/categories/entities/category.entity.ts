import { Book } from "src/books/entities/book.entity";
import { InterestedCategory } from "src/interested-category/entities/interested-category.entity";
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

    @OneToMany(() => Book, (book) => book.category,{ cascade: true, onDelete: 'SET NULL' })
    books: Book[];

     @OneToMany(() => InterestedCategory, interestedCategory => interestedCategory.category)
  interestedCategories: InterestedCategory[];

     @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
