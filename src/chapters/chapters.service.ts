import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chaptersRepository: Repository<Chapter>,
  ) {}

  async create(createChapterDto: CreateChapterDto): Promise<Chapter> {
    const chapter = this.chaptersRepository.create(createChapterDto);
    return this.chaptersRepository.save(chapter);
  }

  findAll(): Promise<Chapter[]> {
    return this.chaptersRepository.find();
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chaptersRepository.findOne({where:{id}});
    if (!chapter) {
      throw new NotFoundException(`Chapter with ID ${id} not found`);
    }
    return chapter;
  }

  async update(id: number, updateChapterDto: UpdateChapterDto): Promise<Chapter> {
    const chapter = await this.findOne(id);
    Object.assign(chapter, updateChapterDto);
    return this.chaptersRepository.save(chapter);
  }

  async remove(id: number): Promise<void> {
    const chapter = await this.findOne(id);
    await this.chaptersRepository.remove(chapter);
  }
}
