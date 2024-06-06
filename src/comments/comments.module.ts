import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Book } from 'src/books/entities/book.entity';
import { BooksModule } from 'src/books/books.module';

@Module({
   imports: [TypeOrmModule.forFeature([Comment,Book]),BooksModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
