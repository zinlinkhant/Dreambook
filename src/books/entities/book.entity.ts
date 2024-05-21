import { Category } from 'src/categories/entities/category.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
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

  @ManyToOne(()=>Category, (category)=> category.books )
  @JoinColumn({name: "categoryId"})
  category:Category;
}
