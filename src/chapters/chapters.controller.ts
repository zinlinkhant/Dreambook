import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createChapterDto: CreateChapterDto) {
    return this.chaptersService.create(createChapterDto);
  }
  @Get()
  findAll() {
    return this.chaptersService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('book/:bookId')
  // findByBookId(@Request() req, @Param('bookId') bookId: number) {
  //   const user = req.user;
  //   return this.chaptersService.findByBookId(user, bookId);
  // }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chaptersService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChapterDto: UpdateChapterDto) {
    return this.chaptersService.update(+id, updateChapterDto);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chaptersService.remove(+id);
  }
}
