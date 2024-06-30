import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    const { bookId, text } = createCommentDto;
    const comment = this.commentsRepository.create({
      text,
      bookId,
      userId: user.id,
    });
    await this.commentsRepository.save(comment);

    return this.commentsRepository.findOne({
      where: { id: comment.id },
      relations: ['user'],
    });
  }

  async findAllBySlug(slug: string){
    const book = await this.bookRepository.findOne({where:{slug}})
    const bookId = book.id
    return this.commentsRepository.find({
      where: { bookId },
      relations: {user:true},
    });
  }

  async update(
    id: number,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id, userId: user.id },
    });
    const userId = user.id;
    if (!comment) {
      throw new NotFoundException(
        `Comment with ID ${id} not found or you do not own this comment`,
      );
    }
    if (comment.userId !== userId) {
      throw new UnauthorizedException('you do not own this comment');
    }
    Object.assign(comment, updateCommentDto);
    await this.commentsRepository.save(comment);
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async remove(id: number, user: User): Promise<string> {
    const comment = await this.commentsRepository.findOne({
      where: { id, userId: user.id },
    });
    const userId = user.id;
    if (!comment) {
      throw new NotFoundException(
        `Comment with ID ${id} not found or you do not own this comment`,
      );
    }
    if (comment.userId !== userId) {
      throw new UnauthorizedException('you do not own this comment');
    }
    await this.commentsRepository.remove(comment);
    return 'deleted';
  }
}
