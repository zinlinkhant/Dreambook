import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BooksService {
    constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) { }
  async create(createBookDto: CreateBookDto) {
    const newBook =await this.bookRepository.create(createBookDto)
    return await this.bookRepository.save(newBook)
  }

  async findAll() {
    const books =await this.bookRepository.find({
      relations:{
        user:true,
        category:true
      }
    })
    return books;
  }

  async findOne(id: number) {
    const book =await this.bookRepository.findOneOrFail({
      where:{
        id
      },
      relations:{
        user:true,
        category:true
      }
  })
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
        const book = await this.findOne(id);

    Object.assign(book, updateBookDto);

    return this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.findOne(id)
    await this.bookRepository.delete(id)
    return book
  }
}
