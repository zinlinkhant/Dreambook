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
import { Chapter } from 'src/chapters/entities/chapter.entity';
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
    @InjectRepository(Chapter)
    private readonly chapterRepository: Repository<Chapter>,
  ) { }

  async create(
    user: User,
    image: Express.Multer.File,
    createBookDto: CreateBookDto,
  ){
    const slug = slugify(createBookDto.title);
    let status = false
    if (createBookDto.status === "true") {
      status = true
    }
    const result = await this.firebaseService.uploadFile(image);
    const book = this.bookRepository.create({
      ...createBookDto,
      coverImg: result,
      slug,
      user,
      status:status
    });
    return this.bookRepository.save(book);
  }
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

    const favoriteBookIds = new Set(userFavorites.map((fav) => fav.bookId));
    const booksWithFavorites = paginatedBooks.items.map((book) => ({
      ...book,
      isFavorited: favoriteBookIds.has(book.id),
    }));
    return new Pagination<Book>(
      booksWithFavorites,
      paginatedBooks.meta,
      paginatedBooks.links,
    );
  }

  async findByUser(
    userId,
    options: IPaginationOptions,
    sort?: string,
    title?: string,
  ) {
    const queryBuilder = this.bookRepository.createQueryBuilder('book');

    if (sort == 'a-z') {
      queryBuilder
        .where('book.userId = :userId', { userId })
        .leftJoinAndSelect('book.user', 'user')
        .leftJoinAndSelect('book.category', 'category')
        .orderBy('book.title', 'ASC');
    } else {
      queryBuilder
        .where('book.userId = :userId', { userId })
        .leftJoinAndSelect('book.user', 'user')
        .leftJoinAndSelect('book.category', 'category')
        .orderBy('book.createdAt', 'DESC');
    }
    if (title) {
      queryBuilder.andWhere('book.title ILIKE :title', { title: `%${title}%` });
    }
    return paginate<Book>(queryBuilder, options);
  }

  async findSingleBook(userId: number, slug: string) {
    const search = await this.bookRepository.findOne({
      where: { slug: slug },
    });

    let book = await this.bookRepository.findOne({
      where: { slug: slug, status: true },
      relations: ['user', 'category'],
    });

    if (search.userId == userId) {
      book = await this.bookRepository.findOne({
        where: { slug: slug },
        relations: ['user', 'category'],
      });
    }
    if (!book) {
      throw new NotFoundException(`Book with slug ${slug} not found`);
    }
    const bookId = book.id;

    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    const isFavorited = await this.favouriteRepository.findOne({
      where: { bookId, userId },
    });

    return {
      ...book,
      isFavorited: !!isFavorited,
    };
  }

  async update(
    user: User,
    slug: string,
    image: Express.Multer.File,
    updateBookDto: UpdateBookDto,
  ) {
    const book = await this.bookRepository.findOne({ where: { slug } });
    if (!book) {
      throw new NotFoundException('book does not exist');
    }
    // if (book.userId !== user.id) {
    //   throw new UnauthorizedException('You do not own this book');
    // }
    let sluged = slug
    let coverImg = book.coverImg;
    if (updateBookDto.title) {
       sluged = slugify(updateBookDto.title);
    }
    let status = false
    if (updateBookDto.status === "true") {
      status = true
    }
    if (image) {
      coverImg = await this.firebaseService.uploadFile(image);
      this.firebaseService.deleteFile(book.coverImg);
    }
    let keywords = book.keywords;
    if (updateBookDto.keywords) {
      keywords = updateBookDto.keywords;
    }
    const updatedBook = this.bookRepository.create({
      ...book,
      ...updateBookDto,
      userId: user.id,
      coverImg,
      keywords,
      slug: sluged,
      status
    });

    return this.bookRepository.save(updatedBook);
  }

  async deleteBook(user: User, slug: string) {
    const book = await this.bookRepository.findOne({ where: { slug: slug } });
    const bookId = book.id;
    if (!book) {
      throw new NotFoundException('can"t find book');
    }
    if (book.userId !== user.id) {
      throw new UnauthorizedException('You do not own this book');
    }
    await this.bookRepository.delete(bookId);
    return 'bookDeleted';
  }
  async favouriteBook(userId): Promise<Book[]> {
    const books = await this.bookRepository
      .createQueryBuilder('book')
      .where('book.status = :status', { status: true })
      .orderBy('book.favouriteCount', 'DESC')
      .leftJoinAndSelect('book.user', 'user')
      .leftJoinAndSelect('book.category', 'category')
      .limit(10)
      .getMany();

    const userFavorites = await this.favouriteRepository.find({
      where: { userId },
      select: ['bookId'],
    });

    const favoriteBookIds = new Set(userFavorites.map((fav) => fav.bookId));
    const booksWithFavorites = books.map((book) => ({
      ...book,
      isFavorited: favoriteBookIds.has(book.id),
    }));

    return booksWithFavorites;
  }

  async findRecommendedBooks(userId: number, options: IPaginationOptions) {
    const interestedCategories = await this.interestedCategoryRepository.find({
      where: { userId },
      relations: ['category'],
    });
    const categoryIds = interestedCategories.map((ic) => ic.categoryId);
    if (categoryIds.length < 1) {
      return this.bookRepository.find({
        where: {
          status: true,
        },
        order: {
          createdAt: 'DESC',
        },
        relations: {
          user: true,
          category: true,
        },
      });
    }

    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .where('book.status = :status', { status: true })
      .innerJoinAndSelect('book.category', 'category')
      .innerJoinAndSelect('book.user', 'user')
      .where('book.categoryId IN (:...categoryIds)', { categoryIds })
      .orderBy('book.createdAt', 'DESC');

    const paginatedBooks = await paginate<Book>(queryBuilder, options);
    const userFavorites = await this.favouriteRepository.find({
      where: { userId },
      select: ['bookId'],
    });
    const favoriteBookIds = new Set(userFavorites.map((fav) => fav.bookId));
    const booksWithFavorites = paginatedBooks.items.map((book) => ({
      ...book,
      isFavorited: favoriteBookIds.has(book.id),
    }));
    return new Pagination<Book>(
      booksWithFavorites,
      paginatedBooks.meta,
      paginatedBooks.links,
    );
  }

  async searchBooks(
    userId: number,
    options: IPaginationOptions,
    title?: string,
    author?: string,
    categoryIds?: number[],
    categoryId?: number,
    searchUserId?: number,
    sort?: string,
  ) {
    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .where('book.status = :status', { status: true })
      .innerJoinAndSelect('book.user', 'user')
      .innerJoinAndSelect('book.category', 'category')
      .orderBy('book.createdAt', 'DESC');

    if (title) {
      queryBuilder
        .andWhere('book.title ILIKE :title', { title: `%${title}%` });
    }

    if (author) {
      queryBuilder
        .andWhere('user.name ILIKE :name', { name: `%${author}%` });
    }

    if (categoryIds?.length > 0) {
      queryBuilder
        .andWhere('category.id IN (:...categoryIds)', {
          categoryIds,
        });
    }
    if (categoryId) {
      queryBuilder
        .andWhere('book.categoryId = :categoryId', { categoryId });
    }
    if (searchUserId) {
      if (userId == searchUserId) {
        return this.findByUser(userId, options)
      }
      queryBuilder
        .where('book.userId = :userId', { userId: searchUserId })
        .andWhere('book.status = :status', { status: true });

    }
    if (sort == 'a-z') {
      queryBuilder
        .orderBy('book.title', 'ASC');
    }
    const paginatedBooks = await paginate<Book>(queryBuilder, options);
    const userFavorites = await this.favouriteRepository.find({
      where: { userId },
      select: ['bookId'],
    });
    const favoriteBookIds = new Set(userFavorites.map((fav) => fav.bookId));
    const booksWithFavorites = paginatedBooks.items.map((book) => ({
      ...book,
      isFavorited: favoriteBookIds.has(book.id),
    }));

    return new Pagination<Book>(
      booksWithFavorites,
      paginatedBooks.meta,
      paginatedBooks.links,
    );
  }

  async findRelatedBooks(slug: string) {
    const book = await this.bookRepository.findOne({ where: { slug: slug } });
    const bookId = book.id;
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }

    const categoryId = book.categoryId;

    const books = await this.bookRepository.find({
      where: { categoryId: categoryId, status: true },
      relations: { user: true, category: true },
      take: 5,
    });

    return books;
  }

  async findUserFavourite(userId: number, sort?: string, title?: string) {
    const queryBuilder = this.favouriteRepository
      .createQueryBuilder('favourite')
      .leftJoinAndSelect('favourite.book', 'book')
      .leftJoinAndSelect('favourite.user', 'user')
      .where('favourite.userId = :userId', { userId })
      .andWhere('book.status = :status', { status: true });

    if (sort === 'a-z') {
      queryBuilder.orderBy('book.title', 'ASC');
    }

    if (title) {
      queryBuilder.andWhere('book.title LIKE :title', { title: `%${title}%` });
    }

    return queryBuilder.getMany();
  }

  // async chapter(){
  //      const books = await this.bookRepository.find({ select: ['id'] });
  //      return this.countChaptersForAllBooks(bo)
  // }

  async chapter(): Promise<{ bookId: number; chapterCount: number }[]> {
    const books = await this.bookRepository.find();
    const counts = [];

    for (const book of books) {
      const chapterCount = await this.chapterRepository.count({
        where: { bookId: book.id },
      });

      await this.bookRepository.update(book.id, { chapterNum: chapterCount });

      counts.push({ bookId: book.id, chapterCount });
    }

    return counts;
  }
}
