import { Test, TestingModule } from '@nestjs/testing';
import { InterestedCategoryService } from './interested-category.service';

describe('InterestedCategoryService', () => {
  let service: InterestedCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InterestedCategoryService],
    }).compile();

    service = module.get<InterestedCategoryService>(InterestedCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
