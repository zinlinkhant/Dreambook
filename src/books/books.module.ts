import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { FirebaseModule } from 'src/services/firebase/firebase.module';
import { InterestedCategory } from 'src/interested-category/entities/interested-category.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Book,Chapter,InterestedCategory,Favourite]),FirebaseModule],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [TypeOrmModule], 
})
export class BooksModule {}
