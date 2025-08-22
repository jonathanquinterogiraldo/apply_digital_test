import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../controllers/products.controller';
import { ProductsService } from '../services/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
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

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
