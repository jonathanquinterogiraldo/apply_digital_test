import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../services/reports.service';
import { DeletedPercentageReportDto } from '../dto/deleted-percentage.report.dto';
import { WithOrWithoutPriceReportDto } from '../dto/with-or-without-price-percentage.report.dto';
import { TopBrandReportDto } from '../dto/top-brand-percentage.report.dto';
import { DateRangeDto } from '../../common/dto/date-range.dto';
import { ReportsController } from '../controllers/reports.controller';

describe('ReportsController', () => {
  let controller: ReportsController;
  let reportsService: jest.Mocked<ReportsService>;

  beforeEach(async () => {
    const mockReportsService: Partial<jest.Mocked<ReportsService>> = {
      getDeletedPercentage: jest.fn(),
      getWithOrWithoutPrice: jest.fn(),
      getTopBrands: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    reportsService = module.get(ReportsService);
  });

  describe('getDeletedPercentage', () => {
    it('should return deleted percentage report', async () => {
      const mockReport: DeletedPercentageReportDto = {
        deletedPercentage: 20,
        notDeletedPercentage: 80,
      };

      (reportsService.getDeletedPercentage as jest.Mock).mockResolvedValue(mockReport);

      const result = await controller.getDeletedPercentage();

      expect((reportsService.getDeletedPercentage as jest.Mock).mock.calls.length).toBe(1);
      expect(result).toBeInstanceOf(DeletedPercentageReportDto);
      expect(result.deletedPercentage).toBe('20.00%');
      expect(result.notDeletedPercentage).toBe('80.00%');
    });
  });

  describe('getWithOrWithoutPrice', () => {
    it('should return with or without price report', async () => {
      const mockReport: WithOrWithoutPriceReportDto = {
        withPricePercentage: 80,
        withoutPricePercentage: 20,
      };
      const dateRange: DateRangeDto = { startDate: '2025-01-01', endDate: '2025-01-31' };

      (reportsService.getWithOrWithoutPrice as jest.Mock).mockResolvedValue(mockReport);

      const result = await controller.getWithOrWithoutPrice(dateRange);

      expect(result).toBeInstanceOf(WithOrWithoutPriceReportDto);
      expect(result.withPricePercentage).toBe('80.00%');
      expect(result.withoutPricePercentage).toBe('20.00%');
    });
  });

  describe('getTopBrands', () => {
    it('should return top brands percentage report', async () => {
      const mockReport: TopBrandReportDto[] = [
        { brand: 'Nike', totalProducts: 4, percentage: 40 },
        { brand: 'Adidas', totalProducts: 3, percentage: 30 },
      ];

      (reportsService.getTopBrands as jest.Mock).mockResolvedValue(mockReport);

      const result = await controller.getTopBrands();

      expect((reportsService.getTopBrands as jest.Mock).mock.calls.length).toBe(1);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(TopBrandReportDto);
      expect(result[0].brand).toBe('Nike');
      expect(result[0].percentage).toBe('40.00%');
      expect(result[0].totalProducts).toBe(4);
      expect(result[1].brand).toBe('Adidas');
      expect(result[1].percentage).toBe('30.00%');
      expect(result[1].totalProducts).toBe(3);
    });
  });
});
