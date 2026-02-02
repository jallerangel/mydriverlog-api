import { INestApplication } from '@nestjs/common';
import { AppFactory } from './helpers/app.factory';
import { DatabaseService } from '../../src/database/database.service';
import { ExampleRepository } from '../../src/repositories/example.repository';
import { ExampleModel } from '../../src/database/models/example.model';

describe('Database Operations (e2e) - API Mode', () => {
  let app: INestApplication;
  let databaseService: DatabaseService;
  let exampleRepository: ExampleRepository;

  beforeAll(async () => {
    app = await AppFactory.createApiApp();
    databaseService = app.get<DatabaseService>(DatabaseService);
    exampleRepository = app.get<ExampleRepository>(ExampleRepository);

    try {
      await databaseService.createTable(new ExampleModel());
    } catch (error) {
      console.log('Table creation skipped (may already exist)');
    }
  });

  afterAll(async () => {
    await AppFactory.closeApp(app);
  });

  it('should connect to DynamoDB via LocalStack', async () => {
    expect(databaseService).toBeDefined();
    const mapper = databaseService.getMapper();
    expect(mapper).toBeDefined();
  });

  it('should be able to create and retrieve an item', async () => {
    const testItem = new ExampleModel({
      PK: `TEST#${Date.now()}`,
      SK: `SK#${Date.now()}`,
      id: `test-${Date.now()}`,
      type: 'test',
      name: 'Test User',
      email: 'test@example.com',
      status: 'active',
      created_at: new Date().toISOString(),
    });

    const created = await exampleRepository.save(testItem);
    expect(created).toBeDefined();
    expect(created.PK).toBe(testItem.PK);
    expect(created.SK).toBe(testItem.SK);

    const retrieved = await exampleRepository.findByPkSk(testItem.PK, testItem.SK);
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe(testItem.name);
    expect(retrieved?.email).toBe(testItem.email);
  });

  it('should be able to query items by partition key', async () => {
    const partitionKey = `TEST#QUERY#${Date.now()}`;

    const item1 = new ExampleModel({
      PK: partitionKey,
      SK: `SK#1`,
      id: `test-1`,
      type: 'test',
      name: 'User 1',
      email: 'user1@example.com',
      created_at: new Date().toISOString(),
    });

    const item2 = new ExampleModel({
      PK: partitionKey,
      SK: `SK#2`,
      id: `test-2`,
      type: 'test',
      name: 'User 2',
      email: 'user2@example.com',
      created_at: new Date().toISOString(),
    });

    await exampleRepository.save(item1);
    await exampleRepository.save(item2);

    const mapper = databaseService.getMapper();
    const queryResults: ExampleModel[] = [];
    const template = new ExampleModel({ PK: partitionKey });
    for await (const item of mapper.query(ExampleModel, template)) {
      queryResults.push(item as ExampleModel);
    }
    expect(queryResults.length).toBeGreaterThanOrEqual(2);
    expect(queryResults.some(item => item.SK === item1.SK)).toBe(true);
    expect(queryResults.some(item => item.SK === item2.SK)).toBe(true);
  });
});
