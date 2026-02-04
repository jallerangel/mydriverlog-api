import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }

  getClient(): PrismaClient {
    return this;
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Prisma client connected');
    } catch (err) {
      this.logger.error('Prisma connection failed', (err as Error)?.message ?? String(err));
      throw err;
    }
  }

  /**
   * Lightweight health check for the database. Returns an object with status and optional message.
   */
  async isHealthy(): Promise<{ status: 'up' | 'down'; message?: string }> {
    try {
      // Works for most SQL databases; Prisma will throw if DB is unreachable
      await this.$queryRaw`SELECT 1`;
      return { status: 'up' };
    } catch (error: any) {
      this.logger.warn(`Prisma health check failed: ${(error as Error)?.message}`);
      return { status: 'down', message: (error as Error)?.message };
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma client disconnected');
  }
}
