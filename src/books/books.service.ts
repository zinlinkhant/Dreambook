import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/services/firebase/firebase.service';
import { slugify } from 'src/utils/slugify';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { User } from '../users/entities/user.entity';
import { InterestedCategory } from '../interested-category/entities/interested-category.entity';
import { Favourite } from 'src/favourite/entities/favourite.entity';
@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    private firebaseService: FirebaseService,
    @InjectRepository(InterestedCategory)
    private readonly interestedCategoryRepository: Repository<InterestedCategory>,
    @InjectRepository(Favourite)
    private readonly favouriteRepository: Repository<Favourite>,
  ) {}

  async create(
    user: User,
    image: Express.Multer.File,
    createBookDto: CreateBookDto,
  ): Promise<Book> {
    const result = await this.firebaseService.uploadFile(image);
    const slug = slugify(createBookDto.title);
    const book = this.bookRepository.create({
      ...createBookDto,
      coverImg: result,
      slug,
      user,
    });
    return this.bookRepository.save(book);
  }

  // async findAll(
  //   options: IPaginationOptions,
  //   searchQuery?: string,
  //   categoryId?: number,
  // ): Promise<Pagination<Book>> {
  //   const queryBuilder = this.bookRepository.createQueryBuilder('book');
  //   if (searchQuery) {
  //     queryBuilder.andWhere(
  //       '(book.title LIKE :searchQuery OR book.description LIKE :searchQuery)',
  //       { searchQuery: `%${searchQuery}%` },
  //     );
  //   }
  //   queryBuilder
  //     .andWhere('book.status = :status', { status: true })
  //     .leftJoinAndSelect('book.user', 'user')
  //     .leftJoinAndSelect('book.category', 'category')
  //     .orderBy('book.createdAt', 'DESC');

  //   return paginate<Book>(queryBuilder, options);
  // }
  async findAll(
    options: IPaginationOptions,
    userId: number,
  ): Promise<Pagination<Book>> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');
    queryBuilder
      .andWhere('book.status = :status', { status: true })
      .leftJoinAndSelect('book.user', 'user')
      .leftJoinAndSelect('book.category', 'category')
      .orderBy('book.createdAt', 'DESC');

    const paginatedBooks = await paginate<Book>(queryBuilder, options);
    const userFavorites = await this.favouriteRepository.find({
      where: { userId },
      select: ['bookId'],
    });

    const favoriteBookIds = new Set(userFavorites.map(fav => fav.bookId));
    const booksWithFavorites = paginatedBooks.items.map(book => ({
      ...book,
      isFavorited: favoriteBookIds.has(book.id),
    }));
    return new Pagination<Book>(booksWithFavorites, paginatedBooks.meta, paginatedBooks.links);
  }


  async findByUser(
    user: User,
    options: IPaginationOptions,
  ): Promise<Pagination<Book>> {
    const userId = user.id;
    const queryBuilder = this.bookRepository.createQueryBuilder('book');
    queryBuilder
      .where('book.userId = :userId', { userId })
      .leftJoinAndSelect('book.user', 'user')
      .leftJoinAndSelect('book.category', 'category')
      .orderBy('book.createdAt', 'DESC');

    return paginate<Book>(queryBuilder, options);
  }

  async findByUserId(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<Book>> {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');
    queryBuilder
      .where('book.userId = :userId', { userId })
      .andWhere('book.status = :status', { status: true })
      .leftJoinAndSelect('book.user', 'user')
      .leftJoinAndSelect('book.category', 'category')
      .orderBy('book.createdAt', 'DESC');

        const paginatedBooks = await paginate<Book>(queryBuilder, options);
    const userFavorites = await this.favouriteRepository.find({
      where: { userId },
      select: ['bookId'],
    });

    const favoriteBookIds = new Set(userFavorites.map(fav => fav.bookId));
    const booksWithFavorites = paginatedBooks.items.map(book => ({
      ...book,
      isFavorited: favoriteBookIds.has(book.id),
    }));
    return new Pagination<Book>(booksWithFavorites, paginatedBooks.meta, paginatedBooks.links);
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

  async findOneWithUser(user: User, id: number) {
    const book = await this.bookRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: {
        user: true,
        category: true,
      },
    });
    return book;
  }

  async update(
    user: User,
    id: number,
    image: Express.Multer.File,
    updateBookDto: UpdateBookDto,
  ) {
    const book = await this.findOneWithUser(user, id);
    if (!book) {
      throw new NotFoundException(`Book not found in this user`);
    }

    if (book.userId !== user.id) {
      throw new UnauthorizedException('You can only update your own books.');
    }
    let coverImg = book.coverImg;
    if (image) {
      coverImg = await this.firebaseService.uploadFile(image);
      this.firebaseService.deleteFile(book.coverImg);
    }
    const updatedBook = this.bookRepository.create({
      ...book,
      ...updateBookDto,
      coverImg,
      keywords: Array.isArray(updateBookDto.keywords)
        ? updateBookDto.keywords
        : book.keywords,
    });
    return this.bookRepository.save(updatedBook);
  }

  async deleteBook(user: User, bookId: number): Promise<void> {
    const book = await this.findOne(bookId);

    if (book.userId !== user.id) {
      throw new UnauthorizedException('You do not own this book');
    }

    await this.bookRepository.delete(bookId);
  }
  async favouriteBook(): Promise<Book[]> {
    return this.bookRepository
      .createQueryBuilder('book')
      .orderBy('book.favouriteCount', 'DESC')
      .limit(10)
      .getMany();
  }

  async findRecommendedBooks(user: User): Promise<Book[]> {
    const userId = user.id
    const interestedCategories = await this.interestedCategoryRepository.find({
      where: { userId },
      relations: ['category'],
    });

    const categoryIds = interestedCategories.map(ic => ic.categoryId);

    if (categoryIds.length === 0) {
      return [];
    }

    // Fetch books that belong to the user's interested categories
    return this.bookRepository
      .createQueryBuilder('book')
      .innerJoinAndSelect('book.category', 'category')
      .innerJoinAndSelect('book.user', 'user')
      .where('book.categoryId IN (:...categoryIds)', { categoryIds })
      .getMany();
  }

  async searchBooks(title?: string, author?: string): Promise<Book[]> {

    if (title) {
      return this.bookRepository
      .createQueryBuilder('book')
      .innerJoinAndSelect('book.user', 'user')
      .innerJoinAndSelect('book.category', 'category')
      .where('book.title ILIKE :title', { title: `%${title}%` })
      .getMany();
    }

    if (author) {
      return this.bookRepository
      .createQueryBuilder('book')
      .innerJoinAndSelect('book.user', 'user')
      .innerJoinAndSelect('book.category', 'category')
      .where('user.name ILIKE :name', { name: `%${author}%` })
      .getMany();
    }
  }
}
