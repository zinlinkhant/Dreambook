import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';
import { History } from './entities/history.entitiy';

@Module({
  imports: [TypeOrmModule.forFeature([History, User, Book])],
  providers: [HistoryService],
  controllers: [HistoryController]
})
export class HistoryModule {}
