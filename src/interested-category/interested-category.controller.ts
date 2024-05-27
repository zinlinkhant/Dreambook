import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InterestedCategoryService } from './interested-category.service';
import { CreateInterestedCategoryDto } from './dto/create-interested-category.dto';
import { UpdateInterestedCategoryDto } from './dto/update-interested-category.dto';

@Controller('interested-category')
export class InterestedCategoryController {
  constructor(private readonly interestedCategoryService: InterestedCategoryService) {}

  @Post()
  create(@Body() createInterestedCategoryDto: CreateInterestedCategoryDto) {
    return this.interestedCategoryService.create(createInterestedCategoryDto);
  }

  @Get()
  findAll() {
    return this.interestedCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestedCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterestedCategoryDto: UpdateInterestedCategoryDto) {
    return this.interestedCategoryService.update(+id, updateInterestedCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interestedCategoryService.remove(+id);
  }
}
