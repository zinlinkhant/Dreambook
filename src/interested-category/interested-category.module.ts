import { Module } from '@nestjs/common';
import { InterestedCategoryService } from './interested-category.service';
import { InterestedCategoryController } from './interested-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterestedCategory } from './entities/interested-category.entity';

@Module({
   imports: [TypeOrmModule.forFeature([InterestedCategory])],
  controllers: [InterestedCategoryController],
  providers: [InterestedCategoryService],
})
export class InterestedCategoryModule {}
