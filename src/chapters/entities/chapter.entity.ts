import { Book } from 'src/books/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('chapters')
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  chapterNum: number;

  @Column({ type: 'int' })
  bookId: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'int' })
  priority: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => Book, (book) => book.chapters)
  @JoinColumn({ name: 'bookId' })
  book: Book;
}
