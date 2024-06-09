import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChapterProgressService } from './chapter-progress.service';
import { CreateChapterProgressDto } from './dto/create-chapter-progress.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('chapter-progress')
export class ChapterProgressController {
  constructor(private readonly chapterProgressService: ChapterProgressService) {}

  @Post()
  create(@Body() createChapterProgressDto: CreateChapterProgressDto, @Request() req) {
    const user:User = req.user
    return this.chapterProgressService.create(createChapterProgressDto,user);
  }

  @Get(':bookId')
  findAllByUserIdInBook(@Param('bookId') bookId: string ,@Request() req) {
    const user:User = req.user
    return this.chapterProgressService.findAllByUserIdInBook(bookId,user);
  }
  // @Patch('')
  // update( @Body() updateChapterProgressDto: UpdateChapterProgressDto,@Request() req) {
  //   const user:User = req.user
  //   return this.chapterProgressService.update(updateChapterProgressDto,user);
  // }
}
