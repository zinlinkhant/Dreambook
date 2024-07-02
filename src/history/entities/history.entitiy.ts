import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  bookId: number;

  @ManyToOne(() => User, user => user.histories,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Book, book => book.histories,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'bookId' })
  book: Book;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
