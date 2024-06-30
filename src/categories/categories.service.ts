import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { FirebaseService } from '../services/firebase/firebase.service';
import { InterestedCategory } from 'src/interested-category/entities/interested-category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private firebaseService: FirebaseService,
    @InjectRepository(InterestedCategory)
    private interestedCategoryRepository: Repository<InterestedCategory>,
  ) {}

  async create(
    image: Express.Multer.File,
    createCategoryDto: CreateCategoryDto,
  ) {
    const result = await this.firebaseService.uploadFile(image);
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      icon: result,
    });
    return this.categoryRepository.save(category);
  }
  async findAll() {
    return this.categoryRepository.find({
      order: { priority: 'DESC' },
    });
  }

  async findOne(id: number) {
    return this.categoryRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async update(
    id,
    image: Express.Multer.File,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    let icon = category.icon;
    if (image) {
      icon = await this.firebaseService.uploadFile(image);
      this.firebaseService.deleteFile(category.icon);
    }

    const updatedCategory = this.categoryRepository.create({
      ...category,
      ...updateCategoryDto,
      icon,
    });

    return this.categoryRepository.save(updatedCategory);
  }
  async remove(id: number) {
    const category = await this.findOne(id);
    return await this.categoryRepository.delete(id);
    return category;
  }
  async getCategoriesByPopular() {
  const queryBuilder = this.interestedCategoryRepository.createQueryBuilder('interested_category')
    .select('interested_category.categoryId')
    .addSelect('COUNT(interested_category.categoryId)', 'count')
    .leftJoinAndSelect('interested_category.category', 'category')
    .groupBy('interested_category.categoryId')
    .addGroupBy('category.id')
    .orderBy('count', 'DESC')
    .limit(6);

  const rawResult = await queryBuilder.getRawMany();
  const categoryIds = rawResult.map(row => row.interested_category_categoryId);
  const categories = await this.categoryRepository.findByIds(categoryIds);
  const sortedCategories = categoryIds.map(id => categories.find(cat => cat.id === id));

  return sortedCategories;
  }
}
