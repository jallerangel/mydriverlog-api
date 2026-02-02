import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from "@prisma/client";
@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);
  private readonly startTime = Date.now();

  constructor(private readonly prismaClient: PrismaClient) {}

  async runExample(): Promise<any> {
    const ids = ['1', '2'];
    const result = await this.prismaClient.user.findMany({
      where: { id: { in: ids } },
    });

    this.logger.log(`runExample fetched ${result.length} users`);
    return result;
  }
}
