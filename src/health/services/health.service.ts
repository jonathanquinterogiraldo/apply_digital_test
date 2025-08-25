import { Injectable } from '@nestjs/common';
import { HealthCheckService, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health.indicator';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @HealthCheck()
  async check() {
    const result = await this.health.check([
      async () => this.db.pingCheck('postgres'),
      async () => this.redis.isHealthy('redis'),
    ]);

    return {
      status: result.status,
      services: {
        postgres: result.details['postgres']?.status,
        redis: result.details['redis']?.status,
      },
    };
  }
}
