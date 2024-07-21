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
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  Query,
} from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
// import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { GROUP_USER } from 'src/utils/group.sealizer';
import { OptionalJwtAuthGuard } from 'src/auth/guard/jwt-optional.guard';

@UseGuards(OptionalJwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  groups: [GROUP_USER],
})
@Controller('chapters')
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  create(
    @Body() createChapterDto: CreateChapterDto,
    @Query('slug') slug: string,
  ) {
    return this.chaptersService.create(createChapterDto, slug);
  }

  @Get('books')
  findByBookId(@Request() req, @Query('slug') slug: string,@Query('sort') sort:string) {
    const user: User = req.user;
    return this.chaptersService.findBySlug(user, slug,sort);
  }

  @Get(':chapterId')
  findOne(@Request() req, @Query('chapterId') chapterId: number) {
    return this.chaptersService.findOne(chapterId);
  }

  @Patch(':chapterId')
  update(
    @Param('chapterId') id: string,
    @Body() updateChapterDto: UpdateChapterDto,
  ) {
    return this.chaptersService.update(+id, updateChapterDto);
  }

  @Delete(':chapterId')
  deleteChapter(@Request() req, @Param('chapterId') chapterId: number) {
    const user: User = req.user;
    return this.chaptersService.deleteChapter(user, chapterId);
  }
}
