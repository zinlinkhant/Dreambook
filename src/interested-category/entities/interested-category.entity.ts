import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity('interested_categories')
export class InterestedCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'int' })
  categoryId: number;

  @ManyToOne(() => User, user => user.interestedCategories,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Category, category => category.interestedCategories,{onDelete:'CASCADE'})
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
