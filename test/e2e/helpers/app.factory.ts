import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType } from '@nestjs/common';
import { AppModule } from '../../../src/app.module';
import { ValidationPipe } from '@nestjs/common';

export interface AppFactoryOptions {
  mode?: 'api' | 'consumer';
  port?: number;
}

export class AppFactory {
  static async createApiApp(options: AppFactoryOptions = {}): Promise<INestApplication> {
    process.env.APP_MODE = 'api';
    if (options.port) {
      process.env.PORT = options.port.toString();
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();

    app.setGlobalPrefix('api', {
      exclude: ['healthz'],
    });
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    return app;
  }

  static async createConsumerApp(): Promise<TestingModule> {
    process.env.APP_MODE = 'consumer';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    return moduleFixture;
  }

  static async closeApp(app: INestApplication | TestingModule): Promise<void> {
    if ('close' in app) {
      await app.close();
    }
  }
}
