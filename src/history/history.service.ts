import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoryDto } from './dto/create-history.dto';
import { History } from './entities/history.entitiy';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class HistoryService {
      constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto,userId){
    const bookId = (await this.bookRepository.findOne({where:{slug:createHistoryDto.bookSlug}})).id
    const history = this.historyRepository.create({bookId,userId});
    return this.historyRepository.save(history);
  }

  async findAllByUser(userId){
    return this.historyRepository.find( {where:{userId:userId}, relations: ['user', 'book'],order: { createdAt: 'DESC' },
  take: 12, });
  }
}
