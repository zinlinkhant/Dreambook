import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Expose } from "class-transformer";
import { GROUP_ADMIN } from "../../utils/group.sealizer";
import { Book } from "src/books/entities/book.entity";

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
    name: string;

    @Column({ nullable: true })
    age: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Book, (book) => book.user)
  books: Book[];
}
