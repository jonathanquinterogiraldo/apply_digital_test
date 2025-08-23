import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmConfig } from './config/typeorm.config';
import { HealthModule } from './health/health.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis/redis.module';
import { ReportsModule } from './reports/reports.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => getTypeOrmConfig(configService),
    }),
    RedisModule,
    ProductsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    HealthModule,
    ReportsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
