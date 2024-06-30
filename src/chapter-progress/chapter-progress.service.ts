import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChapterProgressDto } from './dto/create-chapter-progress.dto';
import { UpdateChapterProgressDto } from './dto/update-chapter-progress.dto';
import { ChapterProgress } from './entities/chapter-progress.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class ChapterProgressService {
  constructor(
    @InjectRepository(ChapterProgress)
    private readonly chapterProgressRepository: Repository<ChapterProgress>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async findAllByUserIdInBook(
    slug: string,
    user: User,
  ): Promise<ChapterProgress[]> {
    const bookId = (await this.bookRepository.findOne({where:{slug:slug}})).id
    return this.chapterProgressRepository.find({
      where: {
        bookId: bookId,
        userId: user.id,
      },
    });
  }

  async create(
    createChapterProgressDto: CreateChapterProgressDto,
    user: User,
    slug:string
  ){
    const book =await this.bookRepository.findOne({where:{slug:slug}})
    const bookId = book.id
    const {chapterProgress} = createChapterProgressDto;
    const existingProgress = await this.chapterProgressRepository.find({
      where: {
        userId: user.id,
        bookId: bookId,
      },
    });
    if (existingProgress.length > 0) {
      const updateDto: UpdateChapterProgressDto = { chapterProgress };
      return this.update(updateDto, user.id, bookId);
    }
    const chapterProgressEntity = this.chapterProgressRepository.create({
      bookId,
      userId: user.id,
      chapterProgress,
    });

    return this.chapterProgressRepository.save(chapterProgressEntity);
  }

  async update(
    updateChapterProgressDto: UpdateChapterProgressDto,
    userid: number,
    bookId: number,
  ): Promise<ChapterProgress> {
    const chapterProgress = await this.chapterProgressRepository.findOne({
      where: {
        bookId,
        userId: userid
      },
    });

    if (!chapterProgress) {
      throw new NotFoundException(
        `ChapterProgress with bookId ${bookId} not found or you do not own this progress`,
      );
    }

    Object.assign(chapterProgress, updateChapterProgressDto);
    return this.chapterProgressRepository.save(chapterProgress);
  }
}
