import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterestedCategoryDto } from './dto/create-interested-category.dto';
import { UpdateInterestedCategoryDto } from './dto/update-interested-category.dto';
import { InterestedCategory } from './entities/interested-category.entity';

@Injectable()
export class InterestedCategoryService {
  constructor(
    @InjectRepository(InterestedCategory)
    private interestedCategoryRepository: Repository<InterestedCategory>,
  ) {}

  async create(createInterestedCategoryDto: CreateInterestedCategoryDto): Promise<InterestedCategory> {
    const interestedCategory = this.interestedCategoryRepository.create(createInterestedCategoryDto);
    return this.interestedCategoryRepository.save(interestedCategory);
  }

  async findAll(): Promise<InterestedCategory[]> {
    return this.interestedCategoryRepository.find();
  }

  async findOne(id: number): Promise<InterestedCategory> {
    return this.interestedCategoryRepository.findOne({ where: { id } });
  }

  async update(id: number, updateInterestedCategoryDto: UpdateInterestedCategoryDto): Promise<InterestedCategory> {
    await this.interestedCategoryRepository.update(id, updateInterestedCategoryDto);
    return this.interestedCategoryRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.interestedCategoryRepository.delete(id);
  }
}
