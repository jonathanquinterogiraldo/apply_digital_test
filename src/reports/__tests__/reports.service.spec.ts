import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../services/reports.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ReportsService,
          useValue: {
            getDeletedPercentage: jest.fn(),
            getWithOrWithoutPrice: jest.fn(),
            getTopBrands: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
