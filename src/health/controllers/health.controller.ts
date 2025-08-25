import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from '../services/health.service';

class HealthResponse {
  status: string;
  services: { postgres: string; redis: string };
}

class HealthErrorResponse {
  status: string;
  services: { postgres?: string; redis?: string };
  error?: string;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Check health of services (Postgres, Redis)' })
  @ApiResponse({ status: 200, type: HealthResponse })
  @ApiResponse({ status: 503, type: HealthErrorResponse })
  async check() {
    return this.healthService.check();
  }
}
