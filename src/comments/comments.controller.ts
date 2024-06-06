import { Controller, Get, Post, Param, Body, Patch, Delete, Request, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const user: User = req.user;
    return this.commentService.create(createCommentDto, user);
  }

  @Get('book/:bookId')
  async findAllByBookId(@Param('bookId') bookId: number) {
    return this.commentService.findAllByBookId(bookId);
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
