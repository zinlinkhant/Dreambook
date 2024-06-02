import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChapterProgressDto } from './dto/create-chapter-progress.dto';
import { UpdateChapterProgressDto } from './dto/update-chapter-progress.dto';
import { ChapterProgress } from './entities/chapter-progress.entity';

@Injectable()
export class ChapterProgressService {
  constructor(
    @InjectRepository(ChapterProgress)
    private readonly chapterProgressRepository: Repository<ChapterProgress>,
  ) {}

  async create(createChapterProgressDto: CreateChapterProgressDto): Promise<ChapterProgress> {
    const chapterProgress = this.chapterProgressRepository.create(createChapterProgressDto);
    return this.chapterProgressRepository.save(chapterProgress);
  }

  async findAll(): Promise<ChapterProgress[]> {
    return this.chapterProgressRepository.find();
  }

  async findOne(id: number): Promise<ChapterProgress> {
    return this.chapterProgressRepository.findOne({ where: { id } });
  }

  async update(id: number, updateChapterProgressDto: UpdateChapterProgressDto): Promise<ChapterProgress> {
    await this.chapterProgressRepository.update(id, updateChapterProgressDto);
    return this.chapterProgressRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.chapterProgressRepository.delete(id);
  }
}
