import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';


@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}


  @UseGuards(JwtAuthGuard)
  @Post(':bookId')
  create(@Body() createChapterDto: CreateChapterDto, @Request() req,@Param('bookId') bookId: number) {
    const user : User = req.user
    return this.chaptersService.create(createChapterDto,user,bookId);
  }



  @UseGuards(JwtAuthGuard)
  @Get('book/:bookId')
  findByBookId(@Request() req, @Param('bookId') bookId: number) {
    const user: User = req.user;
    return this.chaptersService.findByBookId(user, bookId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(+id);
  }
  

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto, @Request()  req) {
    const user = req.user
    return this.chaptersService.update(+id, updateChapterDto,user);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':chapterId')
  deleteChapter(@Request() req, @Param('chapterId') chapterId: number) {
    const user: User = req.user;
    return this.chaptersService.deleteChapter(user, chapterId);
  }
}
