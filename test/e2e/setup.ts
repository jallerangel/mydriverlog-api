const LOCALSTACK_ENDPOINT = process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566';
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'test';
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'test';

const DYNAMODB_TABLE_PREFIX = process.env.DYNAMODB_TABLE_PREFIX || 'test-';
const DYNAMODB_ENDPOINT = process.env.DYNAMODB_ENDPOINT || `${LOCALSTACK_ENDPOINT}`;

const SQS_ENDPOINT = process.env.SQS_ENDPOINT || `${LOCALSTACK_ENDPOINT}`;
const SQS_QUEUE_NAME = process.env.SQS_QUEUE_NAME || 'test-queue.fifo';
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL || `${SQS_ENDPOINT}/000000000000/${SQS_QUEUE_NAME}`;

const EVENTBRIDGE_ENDPOINT = process.env.EVENTBRIDGE_ENDPOINT || `${LOCALSTACK_ENDPOINT}`;
const EVENTBRIDGE_RULE_ARN =
  process.env.EVENTBRIDGE_RULE_ARN || `arn:aws:events:${AWS_REGION}:000000000000:rule/test-rule`;

process.env.NODE_ENV = 'test';
process.env.AWS_REGION = AWS_REGION;
process.env.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID;
process.env.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;
process.env.DYNAMODB_ENDPOINT = DYNAMODB_ENDPOINT;
process.env.DYNAMODB_TABLE_PREFIX = DYNAMODB_TABLE_PREFIX;
process.env.SQS_ENDPOINT = SQS_ENDPOINT;
process.env.SQS_QUEUE_URL = SQS_QUEUE_URL;
process.env.EVENTBRIDGE_ENDPOINT = EVENTBRIDGE_ENDPOINT;
process.env.EVENTBRIDGE_RULE_ARN = EVENTBRIDGE_RULE_ARN;

if (!process.env.REDIS_HOST) {
  process.env.REDIS_HOST = 'localhost';
  process.env.REDIS_PORT = '6379';
}

console.log('🧪 E2E Test Environment Configuration:');
console.log(`   AWS Region: ${AWS_REGION}`);
console.log(`   DynamoDB Endpoint: ${DYNAMODB_ENDPOINT}`);
console.log(`   DynamoDB Table Prefix: ${DYNAMODB_TABLE_PREFIX}`);
console.log(`   SQS Endpoint: ${SQS_ENDPOINT}`);
console.log(`   SQS Queue URL: ${SQS_QUEUE_URL}`);
console.log(`   EventBridge Rule ARN: ${EVENTBRIDGE_RULE_ARN}`);
