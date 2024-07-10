import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Chapter } from 'src/chapters/entities/chapter.entity';
import { FirebaseModule } from 'src/services/firebase/firebase.module';
import { InterestedCategory } from 'src/interested-category/entities/interested-category.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
@Module({
  imports:[TypeOrmModule.forFeature([Book,Chapter,InterestedCategory,Favourite]),FirebaseModule],
  controllers: [BooksController],
  providers: [{
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },BooksService],
  exports: [TypeOrmModule], 
})
export class BooksModule {}
