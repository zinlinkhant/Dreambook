import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChapterProgressDto } from './dto/create-chapter-progress.dto';
import { UpdateChapterProgressDto } from './dto/update-chapter-progress.dto';
import { ChapterProgress } from './entities/chapter-progress.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChapterProgressService {
  constructor(
    @InjectRepository(ChapterProgress)
    private readonly chapterProgressRepository: Repository<ChapterProgress>,
  ) {}

  async findAllByUserIdInBook(
    bookId: string,
    user: User,
  ): Promise<ChapterProgress[]> {
    return this.chapterProgressRepository.find({
      where: {
        bookId: +bookId,
        userId: user.id,
      },
    });
  }

  async create(
    createChapterProgressDto: CreateChapterProgressDto,
    user: User,
  ): Promise<ChapterProgress> {
    const { bookId, chapterProgress } = createChapterProgressDto;
    const existingProgress = await this.chapterProgressRepository.find({
      where: {
        userId: user.id,
        bookId: bookId,
      },
    });
    if (existingProgress !== null) {
      const updateDto: UpdateChapterProgressDto = { chapterProgress };
      return this.update(updateDto, user, bookId);
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
    user: User,
    bookId: number,
  ): Promise<ChapterProgress> {
    const chapterProgress = await this.chapterProgressRepository.findOne({
      where: {
        bookId,
        userId: user.id,
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
