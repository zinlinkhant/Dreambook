import { Module } from '@nestjs/common';
import { ChapterProgressService } from './chapter-progress.service';
import { ChapterProgressController } from './chapter-progress.controller';
import { ChapterProgress } from './entities/chapter-progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChapterProgress]),BooksModule],
  controllers: [ChapterProgressController],
  providers: [ChapterProgressService],
})
export class ChapterProgressModule {}
