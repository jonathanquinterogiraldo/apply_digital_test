import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductsService } from './products.service';

@Injectable()
export class ProductsCronService {
  private readonly logger = new Logger(ProductsCronService.name);

  constructor(private readonly productsService: ProductsService) {}

  // Cronjob executes every hour
  @Cron('0 * * * *')
  async handleCron() {
    this.logger.log('Fetching products from Contentful API...');
    const productsInserted = await this.productsService.autoFetchAndSaveProducts();
    this.logger.log(`${productsInserted} product(s) added at ${new Date().toISOString()}`);
  }
}
