import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../../../src/database/database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: 'DYNAMODB_MAPPER',
          useValue: {
            put: jest.fn(),
            get: jest.fn(),
            delete: jest.fn(),
            query: jest.fn(),
            scan: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return mapper', () => {
    const mapper = service.getMapper();
    expect(mapper).toBeDefined();
  });
});
