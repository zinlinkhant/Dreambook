import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' , nullable:true })
  bookId: number;

  @Column({ type: 'text' })
  text: string;

   @Column({ type: 'int', nullable: true })
  parentId: number;

  @ManyToOne(() => User, user => user.comments,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, book => book.comments,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
