import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('coverImg'))
  create(
  @UploadedFile() image: Express.Multer.File,
  @Body() createBookDto: CreateBookDto) {
    return this.booksService.create(image,createBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.booksService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }

 @Get('user/:userId')
  findByUserId(@Param('userId') userId: number) {
    return this.booksService.findByUserId(userId);
  }

  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: number) {
    return this.booksService.findByCategoryId(categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImg'))
  async update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @UploadedFile() image: Express.Multer.File,) {
    return this.booksService.update(+id,image, updateBookDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.booksService.remove(+id);
  }
}
