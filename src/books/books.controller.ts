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
  ParseIntPipe,
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

    @UseGuards(OptionalJwtAuthGuard)
  @Get('popular')
  async favouriteBook(@Request() req) {
    const userId = req.user.id 
    return this.booksService.favouriteBook(userId);
  }



  @UseGuards(JwtAuthGuard)
  @Get('recommended')
  async findRecommendedBooks(@Request() req, @Query('page') page: number = 1,
    @Query('limit') limit: number = 12) {
    const userId = req.user.id;
    return this.booksService.findRecommendedBooks(userId, { page, limit });
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('related')
  async findRelatedBooks(@Query('bookId') bookId:number) {
    return this.booksService.findRelatedBooks(bookId);
  }


  @UseGuards(OptionalJwtAuthGuard)
  @Get('')
  async searchBooks(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
    @Query('categoryIds', new ParseNumberArrayPipe('categoryIds')) categoryIds?: number[],
    @Query('title') title?: string,
    @Query('author') author?: string,
    @Query('searchUserId') searchUserId?: number,
    @Query('categoryId') categoryId?: number,
    @Query('sort') sort?:string,
  ) {
    const options: IPaginationOptions = {
      page: page || 1,
      limit: limit || 10,
    };
    const userId = req.user.id;
    return this.booksService.searchBooks(userId, options, title, author,categoryIds,categoryId,searchUserId,sort);
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

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findByUser(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
    @Query('sort') sort?:string,
    @Query('title') title?:string
  ) {
    const userId = req.user.id
    return this.booksService.findByUser(userId, { page, limit },sort,title);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('SearchBook/:slug')
  GetSingleBook(
    @Request() req,
    @Param('slug') slug: string,
  ) {
    const userId = req.user.id
    return this.booksService.findSingleBook(userId,slug);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('coverImg'))
  async update(
    @Param('id',ParseIntPipe) id: string,
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

  @UseGuards(JwtAuthGuard)
  @Get('favourite')
  async favourite(@Request() req,@Query('sort') sort?:string,@Query('title') title?:string){
    const userId = req.user.id
     return this.booksService.findUserFavourite(userId,sort,title);
  }

}
