import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

import { FirebaseModule } from 'src/services/firebase/firebase.module';
import { InterestedCategoryModule } from 'src/interested-category/interested-category.module';
import { InterestedCategory } from 'src/interested-category/entities/interested-category.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Category,InterestedCategory]),FirebaseModule,InterestedCategoryModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
