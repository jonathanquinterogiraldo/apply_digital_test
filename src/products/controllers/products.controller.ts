import { Controller, Delete, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProductsService } from '../services/products.service';
import { GetProductsDto } from '../dto/get-products.dto';
import { PaginatedProductsResponse } from '../types/paginated-products';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveProductResponse {
  @ApiProperty({
    description: 'Indicates if the product was successfully removed',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'The ID of the removed product',
    example: 'a1b2c3d4e5',
  })
  removedId: string;
}

export class SeedResponse {
  @ApiProperty({
    description: 'Indicates if the seeding process was successful',
    example: true,
  })
  success: boolean;
}

export class ManuallyPopulationResponse {
  @ApiProperty({
    description: 'Indicates if the manually population process was successful',
    example: true,
  })
  success: boolean;
}

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly logger: Logger
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get paginated products with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default 1)' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default 5)',
  })
  @ApiQuery({
    name: 'otherFilters',
    required: false,
    type: String,
    description: 'Dynamic filters by attributes',
  })
  @ApiResponse({
    status: 200,
    description: 'List of products paginated',
  })
  getPaginatedProducts(
    @Query() attributeFilters: GetProductsDto,
  ): Promise<PaginatedProductsResponse> {
    const { page, limit, ...filters } = attributeFilters;
    return this.productsService.getPaginatedProducts(page, limit, filters);
  }

  @Post('populate')
  @ApiOperation({ summary: 'Populate product data manually from API' })
  @ApiResponse({
    status: 200,
    description: 'Products successfully added',
    type: ManuallyPopulationResponse,
  })
  async fetchProductsManually(
  ): Promise<ManuallyPopulationResponse> {
    this.logger.log('Manually triggered fetching products from Contentful API...');
    const productsInserted = await this.productsService.fetchProductsManuallyFromApi();
    this.logger.log(`${productsInserted} product(s) added at ${new Date().toISOString()}`);
    return { success: true };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product successfully removed',
    type: RemoveProductResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  removeProduct(@Param('id') id: string): Promise<{ success: boolean; removedId: string }> {
    return this.productsService.removeProduct(id);
  }

  @Post('populate-mock-data')
  @ApiOperation({ summary: 'Populate mock data products into database from file' })
  @ApiResponse({
    status: 201,
    description: 'Products successfully seeded',
    type: SeedResponse,
  })
  async seedMockProducts(): Promise<{ success: boolean }> {
    return this.productsService.seedMockProductsFromFile();
  }
}
