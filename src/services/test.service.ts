import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);
  private readonly startTime = Date.now();

  constructor(private readonly prismaClient: PrismaClient) {}

  async runExample(): Promise<any> {
    const result = await this.prismaClient.user.findMany();

    this.logger.log(`runExample fetched ${result.length} users`);
    return result;
  }
}
