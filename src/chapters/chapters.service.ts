import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async create(createChapterDto: CreateChapterDto, slug: string) {
    const book = await this.bookRepository.findOne({
      where: { slug: slug },
    });
    if (!book) {
      throw new NotFoundException(`Book not found.`);
    }
    const bookId = book.id;
    const highestChapter = await this.chaptersRepository
      .createQueryBuilder('chapter')
      .where('chapter.bookId = :bookId', { bookId })
      .orderBy('chapter.chapterNum', 'DESC')
      .getOne();
    let nextChapterNum = 1;
    if (highestChapter) {
      nextChapterNum = highestChapter.chapterNum + 1;
    }

    const existingChapter = await this.chaptersRepository.findOne({
      where: { chapterNum: nextChapterNum, bookId: bookId },
    });

    if (existingChapter) {
      throw new ConflictException('Chapter number already exists in this book');
    }
    let status = false;
    if (createChapterDto.status === 'true') {
      status = true;
    }
    
    const chapter = await this.chaptersRepository.create({
      ...createChapterDto,
      chapterNum: nextChapterNum,
      bookId,
      status: status,
    });
    book.chapterNum += 1;
    await this.bookRepository.save(book);
    return this.chaptersRepository.save(chapter);
  }

  async findBySlug(user: User, slug: string, sort: string): Promise<Chapter[]> {
    const book = await this.bookRepository.findOne({
      where: { slug: slug },
    });
    const bookId = book.id;
    if (!book) {
      throw new NotFoundException(`Book with id ${bookId} not found.`);
    }

    if (book.userId === user.id) {
      return this.chaptersRepository.find({
        where: { bookId },
        order: {
          priority: 'ASC',
        },
      });
    }
    if (sort === 'number') {
       return this.chaptersRepository.find({
        where: { bookId },
        order: {
          chapterNum: 'ASC',
        },
      });
    }
    if (sort === 'latest') {
       return this.chaptersRepository.find({
        where: { bookId },
        order: {
          createdAt: 'DESC',
        },
      });
    }
    return this.chaptersRepository.find({
      where: { bookId, status: true },
      relations: { book: true },
    });
  }

  async findOne(id: number): Promise<Chapter> {
    const chapter = await this.chaptersRepository.findOne({
      where: { id },
      relations: { book: true },
    });
    if (!chapter) {
      throw new NotFoundException(`Chapter not found`);
    }
    return chapter;
  }

  async update(
    id: number,
    updateChapterDto: UpdateChapterDto,
    user: User,
  ): Promise<Chapter> {
    const chapter = await this.findOne(id);
    const book = await this.bookRepository.findOne({
      where: { id: chapter.bookId },
    });

    if (!book) {
      throw new NotFoundException(`Book not found.`);
    }

    if (book.userId !== user.id) {
      throw new UnauthorizedException('You do not own this book');
    }

    Object.assign(chapter, updateChapterDto);
    return this.chaptersRepository.save(chapter);
  }

  async deleteChapter(user: User, chapterId: number) {
    const chapter = await this.findOne(chapterId);
    const book = await this.bookRepository.findOne({
      where: { id: chapter.bookId },
    });
    

    if (!book) {
      throw new NotFoundException(`Book not found.`);
    }

    if (book.userId !== user.id) {
      throw new UnauthorizedException('You do not own this book');
    }
    book.chapterNum -= 1;
    await this.bookRepository.save(book);

    await this.chaptersRepository.delete(chapterId);
    return this.chaptersRepository.find({ where: { bookId: book.id } });
  }
}
