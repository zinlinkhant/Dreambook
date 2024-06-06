import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
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
    id: number,
    updateInterestedCategoryDto: UpdateInterestedCategoryDto,
    user: User
  ){
    const intCat = await this.interestedCategoryRepository.findOne({where:{id}})
    if (intCat.userId !== user.id) {
      throw new UnauthorizedException('User not authorized');
    }
    Object.assign(intCat,updateInterestedCategoryDto)
    return this.interestedCategoryRepository.save(intCat)
  }

  async remove(id: number,user:User): Promise<void> {
    const intCat = await this.interestedCategoryRepository.findOne({where:{id}})
 if (intCat.userId !== user.id) {
      throw new UnauthorizedException('User not authorized');
    }
    await this.interestedCategoryRepository.delete(id);
  }
}
