import { Category } from 'src/categories/entities/category.entity';
import { ChapterProgress } from 'src/chapter-progress/entities/chapter-progress.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';
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

  @Column({ type: 'text' , unique:true})
  title: string;

  @Column({ type: 'text', nullable: true })
  coverImg: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', unique: false })
  slug: string;

  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'text', nullable: false })
  keywords: string[];

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'int' })
  userId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.books)  
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(()=>Category, (category)=> category.books,{ onDelete: 'SET NULL' } )
  @JoinColumn({name: "categoryId"})
  category:Category;

  @OneToMany(() => Chapter, (chapter) => chapter.book)
  chapters: Chapter[];

  @OneToMany(() => ChapterProgress, chapterProgress => chapterProgress.book)
  chapterProgress: ChapterProgress[];

  @OneToMany(() => Favourite, favourite => favourite.book)
  favourites: Favourite[];

   @OneToMany(() => Comment, comment => comment.book)
  comments: Comment[];
}
