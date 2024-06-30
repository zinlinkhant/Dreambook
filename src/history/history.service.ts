import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoryDto } from './dto/create-history.dto';
import { History } from './entities/history.entitiy';

@Injectable()
export class HistoryService {
      constructor(
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
  ) {}

  async create(createHistoryDto: CreateHistoryDto){
    const history = this.historyRepository.create(createHistoryDto);
    return this.historyRepository.save(history);
  }

  async findAllByUser(userId){
    return this.historyRepository.find( {where:{userId:userId}, relations: ['user', 'book'],order: { createdAt: 'DESC' },
  take: 12, });
  }
}
