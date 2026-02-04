import { Module } from '@nestjs/common';
import { ServicesModule } from '../services/services.module.js';
import { HealthController } from './health.controller.js';

@Module({
  imports: [ServicesModule],
  controllers: [HealthController],
})
export class ControllersModule {}
