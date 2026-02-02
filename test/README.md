# Test Structure

This directory contains all test files for the application, organized by test type.

## Directory Structure

```
test/
├── unit/                    # Unit tests
│   ├── controllers/        # Controller unit tests
│   ├── services/           # Service unit tests
│   ├── repositories/       # Repository unit tests
│   └── database/           # Database service tests
├── e2e/                    # End-to-end tests (optional, currently in root)
│   └── app.e2e-spec.ts
├── jest-unit.json          # Jest configuration for unit tests
└── jest-e2e.json           # Jest configuration for e2e tests
```

## Running Tests

### Unit Tests
```bash
npm run test              # Run all unit tests
npm run test:watch        # Run unit tests in watch mode
npm run test:cov          # Run unit tests with coverage
```

### E2E Tests
```bash
npm run test:e2e          # Run end-to-end tests
```

### All Tests
```bash
npm run test:all          # Run both unit and e2e tests
```

## Test Organization

### Unit Tests
Unit tests are located in `test/unit/` and mirror the `src/` directory structure:
- `test/unit/controllers/` - Tests for controllers
- `test/unit/services/` - Tests for services
- `test/unit/repositories/` - Tests for repositories
- `test/unit/database/` - Tests for database services

### E2E Tests
End-to-end tests are located in `test/` root and test the full application flow.

## Writing Tests

### Unit Test Example
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from '../../../src/services/your.service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### E2E Test Example
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/api/v1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1')
      .expect(200);
  });
});
```

## Path Aliases

The test configuration supports the `@/` path alias:
- `@/controllers/...` maps to `src/controllers/...`
- `@/services/...` maps to `src/services/...`
- etc.

## Coverage

Coverage reports are generated in the `coverage/` directory at the project root.

