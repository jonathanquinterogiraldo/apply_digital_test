import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../services/reports.service';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReportsService', () => {
  let service: ReportsService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            count: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDeletedPercentage', () => {
    it('should return 0 percentages when no products', async () => {
      (repo.count as jest.Mock).mockResolvedValueOnce(0);
      const result = await service.getDeletedPercentage();
      expect(result).toEqual({ deletedPercentage: 0, notDeletedPercentage: 0 });
    });

    it('should calculate deleted and notDeleted percentages', async () => {
      (repo.count as jest.Mock).mockResolvedValueOnce(10).mockResolvedValueOnce(3);

      const result = await service.getDeletedPercentage();
      expect(result).toEqual({ deletedPercentage: 30, notDeletedPercentage: 70 });
    });
  });

  describe('getWithOrWithoutPrice', () => {
    it('should return 0 percentages when no products', async () => {
      (repo.count as jest.Mock).mockResolvedValue(0);
      const result = await service.getWithOrWithoutPrice();
      expect(result).toEqual({ withPricePercentage: 0, withoutPricePercentage: 0 });
    });

    it('should calculate withPrice and withoutPrice percentages', async () => {
      (repo.count as jest.Mock).mockResolvedValueOnce(10).mockResolvedValueOnce(8);

      const result = await service.getWithOrWithoutPrice();
      expect(result).toEqual({ withPricePercentage: 80, withoutPricePercentage: 20 });
    });
  });

  describe('getTopBrands', () => {
    it('should return empty array when no products', async () => {
      (repo.find as jest.Mock).mockResolvedValue([]);
      const result = await service.getTopBrands();
      expect(result).toEqual([]);
    });

    it('should return top brands sorted by total products', async () => {
      (repo.find as jest.Mock).mockResolvedValue([
        { brand: 'Nike' },
        { brand: 'Adidas' },
        { brand: 'Nike' },
      ]);

      const result = await service.getTopBrands();
      expect(result).toEqual([
        { brand: 'Nike', totalProducts: 2, percentage: 66.66666666666666 },
        { brand: 'Adidas', totalProducts: 1, percentage: 33.33333333333333 },
      ]);
    });
  });
});
