import { Category } from 'src/categories/entities/category.entity';
import { ChapterProgress } from 'src/chapter-progress/entities/chapter-progress.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';
import { History } from 'src/history/entities/history.entitiy';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  coverImg: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: false, unique: true })
  slug: string;

  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'text', nullable: true, array: true })
  keywords: string[];

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'int' })
  userId: number;
  
  @Column({ type: 'int' , default: 0})
  chapterNum: number;

  @Column({ default: 0 })
  favouriteCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Category, (category) => category.books, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @OneToMany(() => Chapter, (chapter) => chapter.book, { cascade: true, onDelete: 'CASCADE' })
  chapters: Chapter[];

  @OneToMany(() => ChapterProgress, (chapterProgress) => chapterProgress.book, { cascade: true, onDelete: 'CASCADE' })
  chapterProgress: ChapterProgress[];

  @OneToMany(() => Favourite, (favourite) => favourite.book, { cascade: true, onDelete: 'CASCADE' })
  favourites: Favourite[];

  @OneToMany(() => Comment, (comment) => comment.book, { cascade: true, onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => History, (history) => history.book, { cascade: true, onDelete: 'CASCADE' })
  histories: History[];
}
