import { Module, Global, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('DatabaseModule');
        const prisma = new PrismaClient();
        try {
          await prisma.$connect();
          logger.log('Prisma client connected');
        } catch (err) {
          logger.error('Prisma connection failed', err as any);
          throw err;
        }

        return prisma;
      },
      inject: [ConfigService],
    },
    DatabaseService,
  ],
  exports: ['PRISMA_CLIENT', DatabaseService],
})
export class DatabaseModule {}
