# E2E Tests

End-to-end tests for the NestJS application, testing both API and Consumer modes with LocalStack (DynamoDB and SQS).

## Prerequisites

- LocalStack must be running and accessible
- In CI/CD, LocalStack is typically set up via GitHub Actions before running tests
- LocalStack should expose DynamoDB and SQS services

## Environment Variables

The E2E tests automatically configure the following environment variables (with defaults for LocalStack):

- `LOCALSTACK_ENDPOINT` - LocalStack endpoint (default: `http://localhost:4566`)
- `AWS_REGION` - AWS region (default: `us-east-1`)
- `AWS_ACCESS_KEY_ID` - AWS access key (default: `test`)
- `AWS_SECRET_ACCESS_KEY` - AWS secret key (default: `test`)
- `DYNAMODB_ENDPOINT` - DynamoDB endpoint (default: LocalStack endpoint)
- `DYNAMODB_TABLE_PREFIX` - Table name prefix (default: `test-`)
- `SQS_ENDPOINT` - SQS endpoint (default: LocalStack endpoint)
- `SQS_QUEUE_URL` - SQS queue URL (default: constructed from endpoint and queue name)
- `SQS_QUEUE_NAME` - SQS queue name (default: `test-queue.fifo`)
- `EVENTBRIDGE_ENDPOINT` - EventBridge endpoint (default: LocalStack endpoint)
- `EVENTBRIDGE_RULE_ARN` - EventBridge rule ARN (default: test rule ARN)

You can override any of these by setting environment variables before running tests.

## Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with specific environment variables
LOCALSTACK_ENDPOINT=http://localhost:4566 npm run test:e2e
```

## Test Structure

### API Mode Tests

- `health.e2e-spec.ts` - Tests health check endpoints in API mode
- `database.e2e-spec.ts` - Tests DynamoDB operations in API mode

### Consumer Mode Tests

- `consumer.e2e-spec.ts` - Tests SQS consumer functionality in Consumer mode

## Test Helpers

### `AppFactory`

Factory class for creating application instances in different modes:

```typescript
import { AppFactory } from './helpers/app.factory';

// Create API mode app (HTTP server)
const app = await AppFactory.createApiApp();
// ... test API endpoints
await AppFactory.closeApp(app);

// Create Consumer mode app (no HTTP server)
const module = await AppFactory.createConsumerApp();
// ... test consumer services
```

## LocalStack Setup (GitHub Actions)

The repository expects LocalStack to be set up externally (e.g., via GitHub Actions). The tests will connect to LocalStack using the configured endpoints.

Example GitHub Actions workflow:

```yaml
- name: Start LocalStack
  run: |
    docker-compose up -d localstack
    # Wait for LocalStack to be ready
    # Create DynamoDB table
    # Create SQS queue
    # Configure EventBridge rule

- name: Run E2E Tests
  run: npm run test:e2e
  env:
    LOCALSTACK_ENDPOINT: http://localhost:4566
    SQS_QUEUE_URL: http://localhost:4566/000000000000/test-queue.fifo
```

## Test Modes

### API Mode

Tests the HTTP API endpoints:
- Health checks
- DynamoDB operations
- All API routes

### Consumer Mode

Tests the SQS consumer:
- SQS service initialization
- Message sending/receiving
- Queue operations

## Notes

- Tests use real LocalStack connections (not mocks)
- DynamoDB tables are created automatically if they don't exist
- SQS queues should be created by the LocalStack setup script
- Tests clean up after themselves where possible

