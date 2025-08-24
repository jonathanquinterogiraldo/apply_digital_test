import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.healt.indicator';

class HealthResponse {
  status: string;
  services: {
    postgres: string;
    redis: string;
  };
}

class HealthErrorResponse {
  status: string;
  services: {
    postgres?: string;
    redis?: string;
  };
  error?: string;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private postgres: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check health of services (Postgres, Redis)' })
  @ApiResponse({
    status: 200,
    description: 'Health status of application and its dependencies',
    type: HealthResponse,
  })
  @ApiResponse({
    status: 503,
    description: 'One or more services are unhealthy',
    type: HealthErrorResponse,
  })
  async check() {
    const result = await this.health.check([
      () => this.postgres.pingCheck('postgres'),
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
