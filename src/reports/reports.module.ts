import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
