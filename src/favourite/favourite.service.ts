import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { Favourite } from './entities/favourite.entity';
import { User } from 'src/users/entities/user.entity';
import { Book } from 'src/books/entities/book.entity';


@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite)
    private favouritesRepository: Repository<Favourite>,
     @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createFavouriteDto: CreateFavouriteDto, user: User): Promise<Favourite> {
    const { bookId } = createFavouriteDto;

    const book = await  this.booksRepository.findOne({where:{id:bookId}});
    if (!book) {
      throw new NotFoundException(`Book not found.`);
    }

    const existingFavourite = await this.favouritesRepository.findOne({ where: { userId: user.id, bookId } });
    if (existingFavourite) {
      throw new ConflictException(`Book is already in your favourites.`);
    }
    const favourite = this.favouritesRepository.create({ ...createFavouriteDto,user});
    book.favouriteCount += 1;
    await this.booksRepository.save(book);
    return this.favouritesRepository.save(favourite);
  }

    async findAllByBookId(bookId: number,user:User): Promise<Favourite[]> {
       const book = await this.booksRepository.findOne({where:{id:bookId}});
    if (!book) {
        throw new NotFoundException(`Book not found`);
    }
    if (book.userId !== user.id) {
        throw new ForbiddenException(`You do not have permission to access favourites for this book`);
    }
    return this.favouritesRepository.find({ where: { bookId } });
  }

   async findAllByUserId(user: User): Promise<Favourite[]> {
    return this.favouritesRepository.find({ where: { userId:user.id} });
  }


  async deleteById(id: number, user: User): Promise<void> {
    const favourite = await this.favouritesRepository.findOne({where:{id}});
    if (!favourite) {
      throw new NotFoundException(`Favorite with id ${id} not found.`);
    }
    if (favourite.userId !== user.id) {
      throw new UnauthorizedException(`You are not authorized to delete this favourite.`);
    }
     const book = await  this.booksRepository.findOne({where:{id:favourite.bookId}});
    book.favouriteCount -= 1;
    await this.booksRepository.save(book);
    await this.favouritesRepository.remove(favourite);
  }

}
