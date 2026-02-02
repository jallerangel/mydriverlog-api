import { Injectable, Logger, Inject } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

export interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
}

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(private readonly databaseService: DatabaseService) {}

  async checkHealth(): Promise<HealthStatus> {
    let status: HealthStatus['status'] = 'healthy';

    try {
      const dbHealth = await this.databaseService.isHealthy();
      if (dbHealth.status !== 'up') {
        status = 'unhealthy';
        this.logger.warn(`Database reported unhealthy: ${dbHealth.message ?? ''}`);
      }
    } catch (err: any) {
      status = 'unhealthy';
      this.logger.error('Database health check threw an error', err);
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }
}