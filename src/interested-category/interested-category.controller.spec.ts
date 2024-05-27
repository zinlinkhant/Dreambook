import { Test, TestingModule } from '@nestjs/testing';
import { InterestedCategoryController } from './interested-category.controller';
import { InterestedCategoryService } from './interested-category.service';

describe('InterestedCategoryController', () => {
  let controller: InterestedCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestedCategoryController],
      providers: [InterestedCategoryService],
    }).compile();

    controller = module.get<InterestedCategoryController>(InterestedCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
