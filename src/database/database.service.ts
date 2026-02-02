import { Injectable, Inject, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@Inject('PRISMA_CLIENT') private readonly prisma: PrismaClient) {}

  /**
   * Lightweight health check for the database. Returns an object with status and optional message.
   */
  async isHealthy(): Promise<{ status: 'up' | 'down'; message?: string }> {
    try {
      // Works for most SQL databases; Prisma will throw if DB is unreachable
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'up' };
    } catch (error: any) {
      this.logger.warn(`Prisma health check failed: ${error?.message}`);
      return { status: 'down', message: error?.message };
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
