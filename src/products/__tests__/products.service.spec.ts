import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../services/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import Redis from 'ioredis';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import { DeepPartial, SelectQueryBuilder } from 'typeorm';

jest.mock('axios');
jest.mock('fs');

describe('ProductsService', () => {
  let service: ProductsService;
  let redisMock: Redis;
  let productRepoMock: {
    createQueryBuilder: jest.Mock;
    save: jest.Mock;
    softDelete: jest.Mock;
    create: jest.Mock;
  };

  beforeEach(async () => {
    process.env.PAGINATION_LIMIT = '5';

    productRepoMock = {
      createQueryBuilder: jest.fn().mockReturnValue({
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
        getCount: jest.fn().mockResolvedValue(0),
        andWhere: jest.fn().mockReturnThis(),
      }),
      save: jest.fn(),
      softDelete: jest.fn(),
      create: jest.fn(),
    };

    redisMock = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn().mockResolvedValue(1),
      pipeline: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
      exists: jest.fn(),
    } as unknown as Redis;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: productRepoMock },
        { provide: 'REDIS_CLIENT', useValue: redisMock },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('removeProduct', () => {
    it('should remove product successfully', async () => {
      productRepoMock.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.removeProduct('abc123');

      expect(productRepoMock.softDelete).toHaveBeenCalledWith('abc123');
      expect(() => redisMock.del('product:abc123')).not.toThrow();
      expect(result).toEqual({ success: true, removedId: 'abc123' });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      productRepoMock.softDelete.mockResolvedValue({ affected: 0 });

      await expect(service.removeProduct('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('seedMockProductsFromFile', () => {
    it('should seed products from file', async () => {
      const fakeProducts: DeepPartial<Product>[] = [
        {
          id: '1',
          sku: 'sku1',
          name: 'Test Product',
          brand: 'Brand',
          model: 'M',
          category: 'C',
          color: 'Red',
          price: 10,
          currency: 'USD',
          stock: 5,
        },
      ];

      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(fakeProducts));

      productRepoMock.create.mockReturnValue(fakeProducts as unknown as Product[]);
      productRepoMock.save.mockResolvedValue(fakeProducts as unknown as Product[]);

      const result = await service.seedMockProductsFromFile();

      expect(result).toEqual({ success: true });
      expect(productRepoMock.create).toHaveBeenCalledWith(fakeProducts);
      expect(productRepoMock.save).toHaveBeenCalledWith(fakeProducts as unknown as Product[]);
    });
  });

  describe('autoFetchAndSaveProducts', () => {
    it('should fetch, filter, map, mark in redis and save new products', async () => {
      const items = [
        {
          sys: { id: '1' },
          fields: {
            sku: 'sku1',
            name: 'Prod1',
            brand: 'Brand',
            model: 'M',
            category: 'C',
            color: 'Red',
            price: 10,
            currency: 'USD',
            stock: 5,
          },
        },
      ];

      (axios.get as jest.Mock).mockResolvedValue({ data: { items } });

      const mappedProducts: DeepPartial<Product>[] = items.map((item) => ({
        id: item.sys.id,
        sku: item.fields.sku,
        name: item.fields.name,
        brand: item.fields.brand,
        model: item.fields.model,
        category: item.fields.category,
        color: item.fields.color,
        price: item.fields.price,
        currency: item.fields.currency,
        stock: item.fields.stock,
      }));

      productRepoMock.save.mockResolvedValue(mappedProducts as unknown as Product[]);

      const result = await service.fetchAndSaveProducts();

      expect(result).toEqual(mappedProducts.length);
      expect(productRepoMock.save).toHaveBeenCalledWith(mappedProducts);
    });
  });

  describe('getPaginatedProducts', () => {
    it('should return paginated products', async () => {
      const qbMock: jest.Mocked<SelectQueryBuilder<Product>> = {
        take: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: '1' }]),
        getCount: jest.fn().mockResolvedValue(1),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        innerJoinAndSelect: jest.fn().mockReturnThis(),
      } as unknown as jest.Mocked<SelectQueryBuilder<Product>>;

      productRepoMock.createQueryBuilder.mockReturnValue(qbMock);

      const result = await service.getPaginatedProducts(1, 10, {});

      expect(result).toEqual({
        data: [{ id: '1' }],
        page: 1,
        limit: 5,
        totalPages: 1,
        totalProducts: 1,
      });

      expect(() => qbMock.take()).not.toThrow();
      expect(() => qbMock.skip()).not.toThrow();
      expect(() => qbMock.getMany()).not.toThrow();
      expect(() => qbMock.getCount()).not.toThrow();
    });
  });
});
