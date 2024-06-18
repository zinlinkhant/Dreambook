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
  create(@Body() createChapterDto: CreateChapterDto, @Request() req,@Query('bookId') bookId: number) {
    const user : User = req.user
    return this.chaptersService.create(createChapterDto,user,bookId);
  }


  @Get('book')
  findByBookId(@Request() req, @Query('bookId') bookId: number) {
    const user: User = req.user;
    return this.chaptersService.findByBookId(user, bookId);
  }
  
  @Patch(':chapterId')
  update(@Param('chapterId') id: string, @Body() updateChapterDto: UpdateChapterDto, @Request()  req) {
    const user = req.user
    return this.chaptersService.update(+id, updateChapterDto,user);
  }

  @Delete(':chapterId')
  deleteChapter(@Request() req, @Param('chapterId') chapterId: number) {
    const user: User = req.user;
    return this.chaptersService.deleteChapter(user, chapterId);
  }
}
