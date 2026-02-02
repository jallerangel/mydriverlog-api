import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HealthService } from './health.service';
import { TestService } from './test.service';

@Module({
  imports: [DatabaseModule],
  providers: [HealthService, TestService],
  exports: [HealthService, TestService],
})
export class ServicesModule {}
