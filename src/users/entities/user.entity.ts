import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { GROUP_ADMIN } from '../../utils/group.sealizer';
import { Book } from 'src/books/entities/book.entity';
import { Gender } from './gender.enum';
import { ChapterProgress } from 'src/chapter-progress/entities/chapter-progress.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';
import { InterestedCategory } from 'src/interested-category/entities/interested-category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { History } from 'src/history/entities/history.entitiy';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Expose({ groups: [GROUP_ADMIN] })
  password: string;

  @Column({ nullable: true })
  phone:string;

  @Column({ nullable: true })
  bio:string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  profileImg: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Book, (book) => book.user)
  books: Book[];

  @OneToMany(() => ChapterProgress, chapterProgress => chapterProgress.user)
  chapterProgress: ChapterProgress[];

  @OneToMany(() => Favourite, favourite => favourite.user)
  favourites: Favourite[];

  @OneToMany(() => InterestedCategory, interestedCategory => interestedCategory.user)
  interestedCategories: InterestedCategory[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => History, history => history.user)
  histories: History[];
}
