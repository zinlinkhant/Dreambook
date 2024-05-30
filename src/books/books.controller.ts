import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseInterceptors(FileInterceptor('coverImg'))
  create(
  @UploadedFile() image: Express.Multer.File,
  @Body() createBookDto: CreateBookDto) {
    return this.booksService.create(image,createBookDto);
  }
  @Get()
  findAll() {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImg'))
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @UploadedFile() image: Express.Multer.File,) {
    return this.booksService.update(+id,image, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
