import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Query,
  Request,
  ClassSerializerInterceptor,
  SerializeOptions,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { GROUP_USER } from 'src/utils/group.sealizer';
import { OptionalJwtAuthGuard } from 'src/auth/guard/jwt-optional.guard';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  groups: [GROUP_USER],
})
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}


  @Get('search')
  async searchBooks(
    @Query('title') title?: string,
    @Query('author') author?: string,
  ) {
    return this.booksService.searchBooks(title, author);
  }


  @Get('users/favourite')
  async favouriteBook() {
    return this.booksService.favouriteBook();
  }



  @UseGuards(JwtAuthGuard)
  @Get('users/recommended')
  async findRecommendedBooks(@Request() req) {
    const user: User = req.user;
    return this.booksService.findRecommendedBooks(user);
  }
  
  
  
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('coverImg'))
  create(
    @Request() req,
    @UploadedFile() image: Express.Multer.File,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.booksService.create(req.user, image, createBookDto);
  }



@UseGuards(OptionalJwtAuthGuard)
  @Get()
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 12,@Request() req) {
    const userId = req.user.id
    return this.booksService.findAll({ page, limit },userId);
  }

  
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(+id);
  }




  @UseGuards(JwtAuthGuard)
  @Get('user')
  findByUser(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
  ) {
    return this.booksService.findByUser(req.user, { page, limit });
  }



  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  findByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
  ) {
    return this.booksService.findByUserId(userId, { page, limit });
  }



  @UseGuards(JwtAuthGuard)
  @Get('category/:categoryId')
  findByCategoryId(@Param('categoryId') categoryId: number) {
    return this.booksService.findByCategoryId(categoryId);
  }



  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImg'))
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateBookDto: UpdateBookDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.booksService.update(req.user, +id, image, updateBookDto);
  }



  @UseGuards(JwtAuthGuard)
  @Delete(':bookId')
  deleteBook(@Request() req, @Param('bookId') bookId: number) {
    const user: User = req.user;
    return this.booksService.deleteBook(user, bookId);
  }

}
