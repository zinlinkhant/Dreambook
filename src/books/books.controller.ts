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
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ParseNumberArrayPipe } from '../helper/pipe/parseNumberArrayPipe';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  groups: [GROUP_USER],
})
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchBooks(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
    @Query('categoryIds', new ParseNumberArrayPipe('categoryIds')) categoryIds: number[],
    @Query('title') title?: string,
    @Query('author') author?: string,
  ) {
    const options: IPaginationOptions = {
      page: page || 1,
      limit: limit || 10,
    };
    const userId = req.user.id;
    return this.booksService.searchBooks(userId, options, categoryIds, title, author);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('popular/popular')
  async favouriteBook(@Request() req) {
    const userId = req.user.id
    return this.booksService.favouriteBook(userId);
  }



  @UseGuards(JwtAuthGuard)
  @Get('recommended/recommended')
  async findRecommendedBooks(@Request() req, @Query('page') page: number = 1,
    @Query('limit') limit: number = 12) {
    const userId = req.user.id;
    return this.booksService.findRecommendedBooks(userId, { page, limit });
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
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
    @Request() req
  ) {
    const userId = req.user.id
    return this.booksService.findAll({ page, limit }, userId);
  }


  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req.user.id
    return this.booksService.findOneWithUser(userId, +id);
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
  @Get('users/:userId')
  findByUserId(
    @Param('userId') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
  ) {
    return this.booksService.findByUserId(userId, { page, limit });
  }



  // @Get('categories/search-by-categories')
  // findByCategoryIds(@Query('page') page: number = 1,
  //   @Query('limit') limit: number = 12, @Query('categoryIds') categoryIds: any[],) {
  //   return this.booksService.findByCategoryIds(categoryIds,{ page, limit });
  // }



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
