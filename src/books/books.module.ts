import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { FirebaseModule } from 'src/services/firebase/firebase.module';

@Module({
  imports:[TypeOrmModule.forFeature([Book,Chapter]),FirebaseModule],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
