import { Controller, Get, Post, Param, Body, Patch, Delete, Request, UseGuards, UseInterceptors, ClassSerializerInterceptor, SerializeOptions, Query } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { GROUP_USER } from 'src/utils/group.sealizer';

@Controller('comments')
 @UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  groups: [GROUP_USER],
})
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const user: User = req.user;
    return this.commentService.create(createCommentDto, user);
  }
  @Post("reply")
  async reply(@Request() req,@Query('parentId') parentId:number,@Body() replyCommentDto:UpdateCommentDto) {
    const user: User = req.user;
    return this.commentService.createReply(user,parentId,replyCommentDto);
  }

  @Get('book')
  async findAllByBookId(@Query('slug') slug: string) {
    return this.commentService.findAllBySlug(slug);
  }

  @Get(':id')
  async findByComment(@Param('id') id: number){
    return this.commentService.findRepliedComments(id)
  }

  @Get('count/:id')
  async countByComment(@Param('id') id: number){
    return this.commentService.countComments(id)
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCommentDto: UpdateCommentDto, @Request() req) {
    const user: User = req.user;
    return this.commentService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    const user: User = req.user;
    return this.commentService.remove(id, user);
  }
}
