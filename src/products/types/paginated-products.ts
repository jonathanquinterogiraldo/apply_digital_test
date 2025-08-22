import { Product } from '../entities/product.entity';

export type PaginatedProductsResponse = {
  data: Product[];
  page: number;
  limit: number;
  totalPages: number;
  totalProducts: number;
};
