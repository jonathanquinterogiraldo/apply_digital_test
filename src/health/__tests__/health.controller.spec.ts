import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';

describe('HealthController (isolated)', () => {
  let controller: HealthController;
  let healthService: jest.Mocked<HealthService>;

  beforeEach(() => {
    healthService = {
      check: jest.fn(),
    } as unknown as jest.Mocked<HealthService>;

    controller = new HealthController(healthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return health status with postgres and redis', async () => {
    healthService.check.mockResolvedValue({
      status: 'ok',
      services: { postgres: 'up', redis: 'up' },
    });

    const result = await controller.check();

    expect(() => healthService.check()).not.toThrow();
    expect(result).toEqual({
      status: 'ok',
      services: { postgres: 'up', redis: 'up' },
    });
  });
});
