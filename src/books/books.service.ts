import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from 'src/services/firebase/firebase.service';

@Injectable()
export class BooksService {
    constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
     private firebaseService:FirebaseService
  ) { }
  
  async create(image:Express.Multer.File,createBookDto: CreateBookDto) {
    const result = await this.firebaseService.uploadFile(image);
    const book = this.bookRepository.create({
      ...createBookDto,
      coverImg:result
    })
    return this.bookRepository.save(book)
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

  async update(id: number,image:Express.Multer.File, updateBookDto: UpdateBookDto) {
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
