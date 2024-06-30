import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { ChapterProgressService } from './chapter-progress.service';
import { CreateChapterProgressDto } from './dto/create-chapter-progress.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('chapter-progress')
export class ChapterProgressController {
  constructor(private readonly chapterProgressService: ChapterProgressService) {}

  @Post()
  create(@Body() createChapterProgressDto: CreateChapterProgressDto, @Request() req,@Query('slug') slug:string) {
    const user:User = req.user
    return this.chapterProgressService.create(createChapterProgressDto,user,slug);
  }

  @Get()
  findAllByUserIdInBook(@Query('slug') slug: string ,@Request() req) {
    const user:User = req.user
    return this.chapterProgressService.findAllByUserIdInBook(slug,user);
  }
}
