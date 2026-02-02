import { TestingModule } from '@nestjs/testing';
import { SqsService } from '../../src/consumers/sqs.service';
import { ConfigService } from '@nestjs/config';
import { AppFactory } from './helpers/app.factory';
import { SQSClient, SendMessageCommand, GetQueueAttributesCommand } from '@aws-sdk/client-sqs';

describe('SQS Consumer (e2e) - Consumer Mode', () => {
  let module: TestingModule;
  let sqsService: SqsService;
  let configService: ConfigService;
  let sqsClient: SQSClient;
  let queueUrl: string;

  beforeAll(async () => {
    module = await AppFactory.createConsumerApp();
    sqsService = module.get<SqsService>(SqsService);
    configService = module.get<ConfigService>(ConfigService);

    const sqsEndpoint = configService.get<string>('sqs.endpoint');
    queueUrl = configService.get<string>('sqs.queueUrl') || '';

    sqsClient = new SQSClient({
      region: configService.get<string>('aws.region') || 'us-east-1',
      endpoint: sqsEndpoint,
      credentials: {
        accessKeyId: configService.get<string>('aws.accessKeyId') || 'test',
        secretAccessKey: configService.get<string>('aws.secretAccessKey') || 'test',
      },
    });
  });

  afterAll(async () => {
    if (sqsClient) {
      sqsClient.destroy();
    }
  });

  it('should initialize SQS service in consumer mode', () => {
    expect(sqsService).toBeDefined();
    expect(configService.get<string>('appMode')).toBe('consumer');
  });

  it('should be able to send a message to the queue', async () => {
    const testMessage = {
      event: 'test-event',
      data: { test: 'data' },
      timestamp: new Date().toISOString(),
    };

    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(testMessage),
      MessageGroupId: 'test-group',
      MessageDeduplicationId: `test-${Date.now()}`,
    });

    const response = await sqsClient.send(command);
    expect(response.MessageId).toBeDefined();
  });

  it('should be able to check queue attributes', async () => {
    const command = new GetQueueAttributesCommand({
      QueueUrl: queueUrl,
      AttributeNames: ['ApproximateNumberOfMessages', 'ApproximateNumberOfMessagesNotVisible'],
    });

    const response = await sqsClient.send(command);
    expect(response.Attributes).toBeDefined();
    expect(response.Attributes).toHaveProperty('ApproximateNumberOfMessages');
  });

  it('should have queue URL configured', () => {
    expect(queueUrl).toBeDefined();
    expect(queueUrl).toContain('queue');
  });
});
