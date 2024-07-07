import {Body, Controller,Get,Post,Query,Request,UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

  @Post()
  async create(@Body() createHistoryDto: CreateHistoryDto, @Request() req){
    const userId = req.user.id
    return this.historyService.create(createHistoryDto,userId);
  }

  @Get()
  async findAll(@Request() req,    @Query('page') page = 1,
    @Query('limit') limit = 10,){
    const userId = req.user.id
    const options: IPaginationOptions = {
      page,
      limit,
    };
    return this.historyService.findAllByUser(userId,options);
  }
}
