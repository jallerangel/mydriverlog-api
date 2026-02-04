import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { HealthService } from './health.service.js';
import { TestService } from './test.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [HealthService, TestService],
  exports: [HealthService, TestService],
})
export class ServicesModule {}
