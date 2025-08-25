import Redis from 'ioredis';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckError } from '@nestjs/terminus';
import { RedisHealthIndicator } from '../services/redis.health.indicator';

describe('RedisHealthIndicator', () => {
  let indicator: RedisHealthIndicator;
  let mockRedis: jest.Mocked<Redis>;

  beforeEach(async () => {
    mockRedis = {
      ping: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisHealthIndicator, { provide: Redis, useValue: mockRedis }],
    }).compile();

    indicator = module.get<RedisHealthIndicator>(RedisHealthIndicator);
  });

  it('should return healthy status when Redis responds to ping', async () => {
    mockRedis.ping.mockResolvedValue('PONG');

    const result = await indicator.isHealthy('redis');
    expect(result).toEqual({
      redis: { status: 'up' },
    });

    expect(mockRedis.ping).toHaveBeenCalledTimes(1);
  });

  it('should throw HealthCheckError when Redis ping fails', async () => {
    mockRedis.ping.mockRejectedValue(new Error('Connection failed'));

    await expect(indicator.isHealthy('redis')).rejects.toThrow(HealthCheckError);

    try {
      await indicator.isHealthy('redis');
    } catch (err) {
      expect(err).toBeInstanceOf(HealthCheckError);
      expect((err as HealthCheckError).causes).toEqual({
        redis: { status: 'down' },
      });
    }
  });
});
