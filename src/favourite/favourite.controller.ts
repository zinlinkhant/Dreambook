import { Controller, Post, Body,Request, UseGuards, Get, Param, Delete } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('favourites')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createFavouriteDto: CreateFavouriteDto, @Request() req) {
    const user: User = req.user;
    return this.favouriteService.create(createFavouriteDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  findAllByUserId(@Request() req) {
    const user:User = req.user
    return this.favouriteService.findAllByUserId(user)
  }


  @Get('books/:bookId')
  findAllByBookId(@Param('bookId') bookId: number,@Request() req) {
    const user:User = req.user
    return this.favouriteService.findAllByBookId(bookId,user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':bookId')
  remove(@Param('bookId') bookId: string, @Request() req) {
    const user: User = req.user;
    return this.favouriteService.deleteById(+bookId, user);
  }
}