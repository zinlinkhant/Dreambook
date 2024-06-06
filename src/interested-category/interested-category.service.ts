import { Injectable, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInterestedCategoryDto } from './dto/create-interested-category.dto';
import { UpdateInterestedCategoryDto } from './dto/update-interested-category.dto';
import { InterestedCategory } from './entities/interested-category.entity';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Injectable()
export class InterestedCategoryService {
  constructor(
    @InjectRepository(InterestedCategory)
    private interestedCategoryRepository: Repository<InterestedCategory>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
@UseGuards(JwtAuthGuard)
 async create(createInterestedCategoryDto: CreateInterestedCategoryDto,user:User) {
    const { categoryIds } = createInterestedCategoryDto;
    const userId = user.id
    for (let i = 0; i < categoryIds.length; i++) {
      const interestedCategory = this.interestedCategoryRepository.create({
      userId:userId,
      categoryId:categoryIds[i],
    });
     this.interestedCategoryRepository.save(interestedCategory);
    }
    return "Categories added"
  }

  async findAllByUserId(user:User): Promise<InterestedCategory[]> {
    return this.interestedCategoryRepository.find({where:{userId:user.id}});
  }
  async update(
    // id: number,
    // updateInterestedCategoryDto: UpdateInterestedCategoryDto,
    // user: User
  ){
    // if (updateInterestedCategoryDto.userId !== user.id) {
    //   throw new UnauthorizedException('User not authorized');
    // }

    // const interestedCategory = await this.interestedCategoryRepository.findOne({ where: { id } });
    // const newCategory = await this.categoryRepository.findOne({ where: { id: updateInterestedCategoryDto.categoryId } });
    // if (!newCategory) {
    //   throw new NotFoundException(`Category with ID ${updateInterestedCategoryDto.categoryId} not found`);
    // }

    // // Update the categoryId
    // interestedCategory.categoryId = updateInterestedCategoryDto.categoryId;

    // // Save the updated InterestedCategory entity
    // return this.interestedCategoryRepository.save(interestedCategory);
  }

  async remove(id: number): Promise<void> {
    await this.interestedCategoryRepository.delete(id);
  }
}
