import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';


@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chaptersRepository: Repository<Chapter>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async create(createChapterDto: CreateChapterDto, user:User,bookId: number): Promise<Chapter> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });
    if (!book) {
      throw new NotFoundException(`Book not found.`);
    }

    if (book.userId !== user.id) {
      throw new UnauthorizedException('You do not own this book');
    }
    const chapter = this.chaptersRepository.create(createChapterDto);
    return this.chaptersRepository.save(chapter);
  }

async findByBookId(user: User, bookId: number): Promise<Chapter[]> {
    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found.`);
    }

    if (book.userId === user.id) {
      return this.chaptersRepository.find({ where: { bookId } });
    } else {
      return this.chaptersRepository.find({ where: { bookId, status: true } });
    }
  }
  findAll(): Promise<Chapter[]> {
    return this.chaptersRepository.find();
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chaptersRepository.findOne({where:{id}});
    if (!chapter) {
      throw new NotFoundException(`Chapter not found`);
    }
    return chapter;
  }

  async update(id: number, updateChapterDto: UpdateChapterDto, user: User): Promise<Chapter> {
    const chapter = await this.findOne(id);
    const book = await this.bookRepository.findOne({ where: { id: chapter.bookId } });

    if (!book) {
      throw new NotFoundException(`Book not found.`);
    }

    if (book.userId !== user.id) {
      throw new UnauthorizedException('You do not own this book');
    }

    Object.assign(chapter, updateChapterDto);
    return this.chaptersRepository.save(chapter);
  }

 async deleteChapter(user: User, chapterId: number): Promise<void> {
    const chapter = await this.findOne(chapterId);
    const book = await this.bookRepository.findOne({ where: { id: chapter.bookId } });

    if (!book) {
      throw new NotFoundException(`Book not found.`);
    }

    if (book.userId !== user.id) {
      throw new UnauthorizedException('You do not own this book');
    }

    await this.chaptersRepository.delete(chapterId);
  }
}
