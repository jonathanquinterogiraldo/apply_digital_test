import { Controller, Delete, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { GetProductsDto } from '../dto/get-products.dto';
import { PaginatedProductsResponse } from '../types/paginated-products';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getPaginatedProducts(
    @Query() attributeFilters: GetProductsDto,
  ): Promise<PaginatedProductsResponse> {
    const { page, limit, ...filters } = attributeFilters;
    return this.productsService.getPaginatedProducts(page, limit, filters);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productsService.removeProduct(id);
  }
}
