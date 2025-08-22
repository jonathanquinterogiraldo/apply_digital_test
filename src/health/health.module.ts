import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TerminusModule, TypeOrmModule],
  controllers: [HealthController],
  providers: [TypeOrmHealthIndicator],
})
export class HealthModule {}
