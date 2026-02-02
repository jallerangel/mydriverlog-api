import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppFactory } from './helpers/app.factory';

describe('HealthController (e2e) - API Mode', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await AppFactory.createApiApp();
  });

  afterEach(async () => {
    await AppFactory.closeApp(app);
  });

  it('/healthz (GET)', () => {
    return request(app.getHttpServer())
      .get('/healthz')
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('timestamp');
        expect(res.body).toHaveProperty('uptime');
        expect(res.body).toHaveProperty('checks');
        expect(res.body.checks).toHaveProperty('dynamodb');
        expect(res.body.checks).toHaveProperty('redis');
      });
  });

  it('/healthz should not be versioned', () => {
    return request(app.getHttpServer()).get('/api/v1/healthz').expect(404);
  });

  it('should connect to DynamoDB via LocalStack', () => {
    return request(app.getHttpServer())
      .get('/healthz')
      .expect(200)
      .expect(res => {
        expect(res.body.checks).toHaveProperty('dynamodb');
        expect(res.body.checks.dynamodb).toBeDefined();
      });
  });
});
