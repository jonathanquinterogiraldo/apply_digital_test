import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../services/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: 'REDIS_CLIENT',
          useValue: {
            pipeline: jest.fn().mockReturnValue({
              exists: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              exec: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
