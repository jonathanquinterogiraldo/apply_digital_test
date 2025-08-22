import { Controller, Get /* Post, Body, Patch, Param, Delete*/ } from '@nestjs/common';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  async findAll() {
    return this.productsService.getAllProducts();
  }
}
