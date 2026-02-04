import { ApiProperty } from '@nestjs/swagger';

export class HealthStatusDto {
  @ApiProperty({
    description: 'Overall health status',
    enum: ['healthy', 'unhealthy', 'degraded'],
    example: 'healthy',
  })
  status: 'healthy' | 'unhealthy' | 'degraded';

  @ApiProperty({
    description: 'ISO timestamp of the health check',
    example: '2024-12-05T23:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Application uptime in seconds',
    example: 3600,
  })
  uptime: number;
}
