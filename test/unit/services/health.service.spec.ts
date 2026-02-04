import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '../../../src/services/health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return healthy status when all services are up', async () => {
    const health = await service.checkHealth();

    expect(health.status).toBe('up');
    expect(health).toHaveProperty('timestamp');
    expect(health).toHaveProperty('uptime');
  });
});
