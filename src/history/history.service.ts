import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoryDto } from './dto/create-history.dto';
import { History } from './entities/history.entitiy';
import { Book } from 'src/books/entities/book.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto, userId) {
    const bookId = (
      await this.bookRepository.findOne({
        where: { slug: createHistoryDto.bookSlug },
      })
    ).id;
    const prevHistory = await this.historyRepository.findOne({
      where: { userId: userId, bookId: bookId },
    });
    if (prevHistory) {
      await this.historyRepository.remove(prevHistory);
    }
    const history = this.historyRepository.create({ bookId, userId });
    return this.historyRepository.save(history);
  }

  async findAllByUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<History>> {
    const queryBuilder = this.historyRepository
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.user', 'user')
      .leftJoinAndSelect('history.book', 'book')
      .leftJoinAndSelect('book.category', 'category')
      .where('history.userId = :userId', { userId })
      .orderBy('history.createdAt', 'DESC');

    return paginate<History>(queryBuilder, options);
  }
}
