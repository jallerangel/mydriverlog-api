import {
  Controller,
  Get,
  HttpStatus,
  HttpException,
  VERSION_NEUTRAL,
  Version,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService, HealthStatus } from '../services/health.service.js';
import { HealthStatusDto } from '../common/dto/health-status.dto.js';
import { TestService } from '../services/test.service.js';

/**
 * Health Check Controller
 * Provides /healthz endpoint for Kubernetes and monitoring
 * This endpoint is NOT versioned as it's a standard health check endpoint
 */
@ApiTags('health')
@Controller()
export class HealthController {
  constructor(
    private readonly healthService: HealthService,
    private readonly testService: TestService,
  ) {}

  @Get('/healthz')
  @Version(VERSION_NEUTRAL)
  @ApiOperation({
    summary: 'Health check endpoint',
    description:
      'Returns the health status of the application. Used by Kubernetes liveness and readiness probes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy or degraded',
    type: HealthStatusDto,
  })
  async getHealth(): Promise<HealthStatus> {
    await this.testService.runExample();

    const health = await this.healthService.checkHealth();

    if (health.status === 'unhealthy') {
      throw new HttpException(health, HttpStatus.SERVICE_UNAVAILABLE);
    }

    return health;
  }
}
