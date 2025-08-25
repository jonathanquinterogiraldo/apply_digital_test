import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './controllers/health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { RedisHealthIndicator } from './services/redis.health.indicator';
import { HealthService } from './services/health.service';

@Module({
  imports: [TerminusModule, TypeOrmModule],
  controllers: [HealthController],
  providers: [
    TypeOrmHealthIndicator,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () =>
        new Redis({
          host: process.env.REDIS_HOST || 'localhost',
          port: Number(process.env.REDIS_PORT) || 6379,
        }),
    },
    {
      provide: RedisHealthIndicator,
      useFactory: (client: Redis) => new RedisHealthIndicator(client),
      inject: ['REDIS_CLIENT'],
    },
    HealthService,
  ],
  exports: ['REDIS_CLIENT', RedisHealthIndicator],
})
export class HealthModule {}
