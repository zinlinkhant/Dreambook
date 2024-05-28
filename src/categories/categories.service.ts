import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from '../services/firebase/firebase.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private firebaseService:FirebaseService
  ){}

  async create(
    image:Express.Multer.File,
    createCategoryDto: CreateCategoryDto) {
      const result = await this.firebaseService.uploadFile(image);
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      icon:result
    })
    return this.categoryRepository.save(category)
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
