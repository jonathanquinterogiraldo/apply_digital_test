import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from '../controllers/reports.controller';
import { ReportsService } from '../services/reports.service';

describe('ReportsController', () => {
  let controller: ReportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
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

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
