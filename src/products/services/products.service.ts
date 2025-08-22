import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import Redis from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { ContentfulProduct } from '../dto/contentful-product.interface';
import { InjectRedis } from 'src/redis/redis.decorators';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRedis() private readonly redis: Redis,
  ) { }

  // Main function for fetch and save contentful product in postgres if they don not exist
  async autoFetchAndSaveProducts(): Promise<void> {
    try {
      const items = await this.fetchProductsFromContentful();
      const { newItems, newKeys } = await this.filterExistingProducts(items);
      const productsToInsert = this.mapItemsToProducts(newItems);

      await this.markProductsInRedis(newKeys);

      if (productsToInsert.length > 0) {
        await this.productRepo.save(productsToInsert);
      }
    } catch {
      throw new HttpException('Failed to fetch products', 500);
    }
  }

  // Fetch products from Contentful API
  private async fetchProductsFromContentful(): Promise<ContentfulProduct[]> {
    const url = `${process.env.CONTENTFUL_URL_BASE}/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries`;
    const response: AxiosResponse<{ items: ContentfulProduct[] }> = await axios.get(url, {
      params: {
        access_token: process.env.CONTENTFUL_ACCESS_TOKEN,
        content_type: process.env.CONTENTFUL_CONTENT_TYPE,
        locale: process.env.CONTENTFUL_LOCALE,
      },
    });
    return response?.data?.items;
  }

  // Filter products already stored in Redis
  private async filterExistingProducts(
    items: ContentfulProduct[],
  ): Promise<{ newItems: ContentfulProduct[]; newKeys: string[] }> {
    const existsPipeline = this.redis.pipeline();
    items.forEach((item) => existsPipeline.exists(`product:${item.sys.id}`));
    const existsResults = (await existsPipeline.exec()) ?? [];

    const newItems = items.filter((_, index) => {
      const exists = existsResults[index]?.[1] ?? 0;
      return !exists;
    });

    const newKeys = newItems.map((item) => `product:${item.sys.id}`);
    return { newItems, newKeys };
  }

  // Map Contentful items to Product entities
  private mapItemsToProducts(items: ContentfulProduct[]): Product[] {
    return items.map((item) => {
      const fields = item.fields;
      return {
        id: item.sys.id,
        sku: fields.sku ?? '',
        name: fields.name ?? '',
        brand: fields.brand ?? '',
        model: fields.model ?? '',
        category: fields.category ?? '',
        color: fields.color ?? '',
        price: fields.price ?? 0,
        currency: fields.currency ?? 'USD',
        stock: fields.stock ?? 0,
      } as Product;
    });
  }

  // Mark products in Redis in order to compare against the next iteration
  private async markProductsInRedis(keys: string[]): Promise<void> {
    if (!keys.length) return;
    const pipeline = this.redis.pipeline();
    keys.forEach((key) => pipeline.set(key, '1'));
    await pipeline.exec();
  }

  async getAllProducts() {
    return this.productRepo.find();
  }
}
