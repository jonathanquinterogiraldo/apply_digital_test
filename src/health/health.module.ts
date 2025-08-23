import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmHealthIndicator } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { RedisHealthIndicator } from './redis.healt.indicator';

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
  ],
  exports: ['REDIS_CLIENT', RedisHealthIndicator],
})
export class HealthModule {}
