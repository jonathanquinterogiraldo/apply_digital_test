import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../services/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import Redis from 'ioredis';
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';

jest.mock('axios');
jest.mock('fs');

describe('ProductsService', () => {
  let service: ProductsService;
  let redisMock: Redis;
  let productRepoMock: any;

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
    } as any;

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
      (redisMock.del as jest.Mock).mockResolvedValue(1);

      const result = await service.removeProduct('abc123');

      expect(productRepoMock.softDelete).toHaveBeenCalledWith('abc123');
      expect(redisMock.del).toHaveBeenCalledWith('product:abc123');
      expect(result).toEqual({ success: true, removedId: 'abc123' });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      productRepoMock.softDelete.mockResolvedValue({ affected: 0 });

      await expect(service.removeProduct('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('seedMockProductsFromFile', () => {
    it('should seed products from file', async () => {
      const fakeProducts = [{ id: '1', name: 'Test Product' }];

      const readFileSyncSpy = jest
        .spyOn(fs, 'readFileSync')
        .mockImplementation(() => JSON.stringify(fakeProducts));

      productRepoMock.create.mockReturnValue(fakeProducts);
      productRepoMock.save.mockResolvedValue(fakeProducts);

      const result = await service.seedMockProductsFromFile();

      expect(result).toEqual({ success: true });
      expect(productRepoMock.create).toHaveBeenCalledWith(fakeProducts);
      expect(productRepoMock.save).toHaveBeenCalledWith(fakeProducts);

      readFileSyncSpy.mockRestore();
    });
  });
  describe('autoFetchAndSaveProducts', () => {
    it('should fetch, filter, map, mark in redis and save new products', async () => {
      const items = [{ sys: { id: '1' }, fields: { name: 'Prod1', price: 10 } }];
      (axios.get as jest.Mock).mockResolvedValue({ data: { items } });
      const saveSpy = productRepoMock.save.mockResolvedValue(items);

      const result = await service.autoFetchAndSaveProducts();

      expect(result).toEqual(items.length);
      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('getPaginatedProducts', () => {
    it('should return paginated products', async () => {
      const qb = productRepoMock.createQueryBuilder();
      qb.getMany.mockResolvedValue([{ id: '1' }]);
      qb.getCount.mockResolvedValue(1);

      const result = await service.getPaginatedProducts(1, 10, {});

      expect(result).toEqual({
        data: [{ id: '1' }],
        page: 1,
        limit: 5,
        totalPages: 1,
        totalProducts: 1,
      });
    });
  });
});
