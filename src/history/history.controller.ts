import {Body, Controller,Get,Post,Request,UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}

  @Post()
  async create(@Body() createHistoryDto: CreateHistoryDto){
    return this.historyService.create(createHistoryDto);
  }

  @Get()
  async findAll(@Request() req){
    const userId = req.user.id
    return this.historyService.findAllByUser(userId);
  }
}
