import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductsDto {
  // Pagination
  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page (1 to 5)', example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'The min limit number must be 1' })
  @Max(5, { message: 'The max limit number must be 5' })
  @Type(() => Number)
  limit?: number;

  // Filters
  @ApiPropertyOptional({ description: 'Filter by product ID', example: '3CGfV0tqhqL5gPsl9G7Jyj' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: 'Filter by product name', example: 'Acer HD 450BT' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filter by product category', example: 'Laptop' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by minimum price', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by maximum price', example: 2000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter by brand', example: 'Apple' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Filter by model', example: 'MacBook Pro' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ description: 'Filter by color', example: 'Silver' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ description: 'Filter by stock availability', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  stock?: number;

  @ApiPropertyOptional({ description: 'Filter by currency', example: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ description: 'Filter by SKU', example: 'EIXBLZAR' })
  @IsOptional()
  @IsString()
  sku?: string;
}
