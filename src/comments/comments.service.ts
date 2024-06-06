import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User): Promise<Comment> {
    const { bookId, text } = createCommentDto;
    const comment = this.commentsRepository.create({
      text,
      bookId,
      userId: user.id,
    });

    return this.commentsRepository.save(comment);
  }

  async findAllByBookId(bookId: number): Promise<Comment[]> {
    return this.commentsRepository.find({ where: { bookId }, relations: ['user'] });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: User): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id, userId: user.id } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found or you do not own this comment`);
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: number, user: User): Promise<string> {
    const comment = await this.commentsRepository.findOne({ where: { id, userId: user.id } });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found or you do not own this comment`);
    }

    await this.commentsRepository.remove(comment);
    return "deleted"
  }
}
