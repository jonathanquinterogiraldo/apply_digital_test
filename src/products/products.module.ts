import { Module } from '@nestjs/common';
import { ProductsService } from './services/products.service';
import { ProductsController } from './controllers/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsCronService } from './services/products.cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product])
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsCronService],
})
export class ProductsModule { }
