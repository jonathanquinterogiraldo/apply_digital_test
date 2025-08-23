import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.healt.indicator';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    const result = await this.health.check([
      () => this.db.pingCheck('postgres'),
      () => this.redis.isHealthy('redis'),
    ]);

    return {
      status: result.status,
      services: Object.fromEntries(
        Object.entries(result.details).map(([key, value]) => [key, value.status]),
      ),
    };
  }
}
