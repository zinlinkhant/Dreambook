import { Injectable } from '@nestjs/common';
import { CreateInterestedCategoryDto } from './dto/create-interested-category.dto';
import { UpdateInterestedCategoryDto } from './dto/update-interested-category.dto';

@Injectable()
export class InterestedCategoryService {
  create(createInterestedCategoryDto: CreateInterestedCategoryDto) {
    return 'This action adds a new interestedCategory';
  }

  findAll() {
    return `This action returns all interestedCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interestedCategory`;
  }

  update(id: number, updateInterestedCategoryDto: UpdateInterestedCategoryDto) {
    return `This action updates a #${id} interestedCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} interestedCategory`;
  }
}
