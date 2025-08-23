import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.healt.indicator';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: HealthCheckService, useValue: {} },
        { provide: TypeOrmHealthIndicator, useValue: {} },
        { provide: RedisHealthIndicator, useValue: {} }, // <--- mock para Redis
        { provide: 'TERMINUS_ERROR_LOGGER', useValue: {} },
        { provide: 'TERMINUS_LOGGER', useValue: {} },
        { provide: 'HealthCheckExecutor', useValue: {} },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
