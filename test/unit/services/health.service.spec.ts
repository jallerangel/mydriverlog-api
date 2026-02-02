import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from '../../../src/services/health.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('HealthService', () => {
  let service: HealthService;
  let mockCacheManager: any;
  let mockDynamoDbClient: any;

  beforeEach(async () => {
    mockCacheManager = {
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn().mockResolvedValue('ok'),
      del: jest.fn().mockResolvedValue(undefined),
    };

    mockDynamoDbClient = {
      listTables: jest.fn().mockReturnValue({
        promise: jest.fn().mockResolvedValue({ TableNames: [] }),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: 'DYNAMODB_CLIENT',
          useValue: mockDynamoDbClient,
        },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return healthy status when all services are up', async () => {
    const health = await service.checkHealth();

    expect(health.status).toBe('healthy');
    expect(health.checks.dynamodb.status).toBe('up');
    expect(health.checks.redis.status).toBe('up');
    expect(health).toHaveProperty('timestamp');
    expect(health).toHaveProperty('uptime');
  });

  it('should return healthy status when DynamoDB is up but Redis is down (Redis is optional)', async () => {
    mockCacheManager.get = jest.fn().mockRejectedValue(new Error('Redis failed'));

    const health = await service.checkHealth();

    expect(health.status).toBe('healthy');
    expect(health.checks.dynamodb.status).toBe('up');
    expect(health.checks.redis.status).toBe('down');
    expect(health.checks.redis.optional).toBe(true);
  });

  it('should return unhealthy status when DynamoDB is down (regardless of Redis)', async () => {
    mockDynamoDbClient.listTables = jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('Connection failed')),
    });

    const health = await service.checkHealth();

    expect(health.status).toBe('unhealthy');
    expect(health.checks.dynamodb.status).toBe('down');
    // Redis status doesn't matter when DynamoDB is down
  });

  it('should return unhealthy status when DynamoDB is down even if Redis is up', async () => {
    mockDynamoDbClient.listTables = jest.fn().mockReturnValue({
      promise: jest.fn().mockRejectedValue(new Error('Connection failed')),
    });
    // Redis is up
    mockCacheManager.get = jest.fn().mockResolvedValue('ok');

    const health = await service.checkHealth();

    expect(health.status).toBe('unhealthy');
    expect(health.checks.dynamodb.status).toBe('down');
    expect(health.checks.redis.status).toBe('up');
  });
});
