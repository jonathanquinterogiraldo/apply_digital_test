import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../services/products.service';
import { GetProductsDto } from '../dto/get-products.dto';
import { PaginatedProductsResponse } from '../types/paginated-products';
import { ProductsController } from '../controllers/products.controller';
import { Product } from '../entities/product.entity';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getPaginatedProducts: jest.fn(),
            removeProduct: jest.fn(),
            seedMockProductsFromFile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get(ProductsService);
  });

  describe('getPaginatedProducts', () => {
    it('should return paginated products', async () => {
      const dto: GetProductsDto = { page: 1, limit: 5 };
      const mockResponse: PaginatedProductsResponse = {
        data: [{ id: '123', name: 'Product 1' } as Product],
        page: 1,
        limit: 5,
        totalPages: 1,
        totalProducts: 1,
      };

      service.getPaginatedProducts.mockResolvedValue(mockResponse);

      const result = await controller.getPaginatedProducts(dto);

      expect(() => service.getPaginatedProducts(dto.page, dto.limit, {})).not.toThrow();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeProduct', () => {
    it('should remove a product and return success response', async () => {
      const productId = 'a1b2c3d4e5';
      const mockResponse = { success: true, removedId: productId };

      service.removeProduct.mockResolvedValue(mockResponse);

      const result = await controller.removeProduct(productId);

      const removeFn = () => service.removeProduct(productId);
      expect(removeFn).not.toThrow();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('seedMockProducts', () => {
    it('should seed products and return success', async () => {
      const mockResponse = { success: true };
      service.seedMockProductsFromFile.mockResolvedValue(mockResponse);

      const result = await controller.seedMockProducts();

      const seedFn = () => service.seedMockProductsFromFile();
      expect(seedFn).not.toThrow();
      expect(result).toEqual(mockResponse);
    });
  });
});
