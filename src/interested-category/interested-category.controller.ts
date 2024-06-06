import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { InterestedCategoryService } from './interested-category.service';
import { CreateInterestedCategoryDto } from './dto/create-interested-category.dto';
import { UpdateInterestedCategoryDto } from './dto/update-interested-category.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('interested-category')
@UseGuards(JwtAuthGuard)
export class InterestedCategoryController {
  constructor(private readonly interestedCategoryService: InterestedCategoryService) {}
  
  @Post()
  create(@Body() createInterestedCategoryDto: CreateInterestedCategoryDto,@Request() req) {
    const user:User = req.user
    return this.interestedCategoryService.create(createInterestedCategoryDto,user);
  }

  @Get()
  findAllByUserId(@Request() req) {
    const user:User = req.user
    return this.interestedCategoryService.findAllByUserId(user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterestedCategoryDto: UpdateInterestedCategoryDto,@Request() req) {
    const user:User = req.user
    // return this.interestedCategoryService.update(+id, updateInterestedCategoryDto,user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interestedCategoryService.remove(+id);
  }
}
