import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { slugify } from 'src/utils/slugify';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private firebaseService: FirebaseService,
  ) {}

  async create(image: Express.Multer.File, createBookDto: CreateBookDto): Promise<Book> {
    const result = await this.firebaseService.uploadFile(image);
    const slug = slugify(createBookDto.title)
    const book = this.bookRepository.create({
      ...createBookDto,
      coverImg: result,
      slug
    });
    return this.bookRepository.save(book);
  }

  async findAll(options: IPaginationOptions) {
   const queryBuilder = this.bookRepository.createQueryBuilder('book');
    queryBuilder
      .where('book.status = :status', { status: true })
      .leftJoinAndSelect('book.user', 'user')
      .leftJoinAndSelect('book.category', 'category')
      .orderBy('book.createdAt', 'DESC');

    return paginate<Book>(queryBuilder, options);
  }

  async findByUserId(userId: number): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.userId = :userId', { userId })
      .getMany();
  }
  async findByCategoryId(categoryId: number): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .where('book.categoryId = :categoryId', { categoryId })
      .getMany();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOneOrFail({
      where: {
        id,
      },
      relations: {
        user: true,
        category: true,
      },
    });
    return book;
  }

  async update (
    id: number,
    image: Express.Multer.File,
    updateBookDto: UpdateBookDto,
  ){
    const book = await this.bookRepository.findOne({where:{id}});
    let coverImg = book.coverImg;
    if (image) {
      coverImg = await this.firebaseService.uploadFile(image);
      this.firebaseService.deleteFile(book.coverImg)
    }
    const updatedBook = this.bookRepository.create({
      ...book,
      ...updateBookDto,
      coverImg,
      keywords: Array.isArray(updateBookDto.keywords) ? updateBookDto.keywords : book.keywords
  });
    return this.bookRepository.save(updatedBook);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    await this.bookRepository.delete(id);
    return book;
  }
}
