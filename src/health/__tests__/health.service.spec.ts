import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '../services/health.service';
import { HealthCheckResult, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from '../services/redis.health.indicator';

describe('HealthService', () => {
  let service: HealthService;
  let healthCheckService: jest.Mocked<HealthCheckService>;
  let db: jest.Mocked<TypeOrmHealthIndicator>;
  let redis: jest.Mocked<RedisHealthIndicator>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: RedisHealthIndicator,
          useValue: {
            isHealthy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
    healthCheckService = module.get(HealthCheckService);
    db = module.get(TypeOrmHealthIndicator);
    redis = module.get(RedisHealthIndicator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return health status with postgres and redis up', async () => {
    const mockResult: HealthCheckResult = {
      status: 'ok',
      info: {},
      error: {},
      details: {
        postgres: { status: 'up' },
        redis: { status: 'up' },
      },
    };
    healthCheckService.check.mockResolvedValue(mockResult);

    const result = await service.check();

    expect(healthCheckService.check).toHaveBeenCalled();
    expect(result).toEqual({
      status: 'ok',
      services: {
        postgres: 'up',
        redis: 'up',
      },
    });
  });

  it('should return health status with postgres down', async () => {
    const mockResult: HealthCheckResult = {
      status: 'error',
      info: {},
      error: {},
      details: {
        postgres: { status: 'down' },
        redis: { status: 'up' },
      },
    };

    healthCheckService.check.mockResolvedValue(mockResult);

    const result = await service.check();

    expect(result).toEqual({
      status: 'error',
      services: {
        postgres: 'down',
        redis: 'up',
      },
    });
  });
});
