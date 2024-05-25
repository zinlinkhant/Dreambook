import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ){}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto)
    return await this.categoryRepository.save(category)
  }

  async findAll() {
    return this.categoryRepository.find()
  }

  async findOne(id: number) {
    return this.categoryRepository.findOneOrFail({
      where:{
        id
      }
    })
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)
    Object.assign(category,updateCategoryDto)
    return this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category =await this.findOne(id)
    return await this.categoryRepository.delete(id)
    return category
  }
}
