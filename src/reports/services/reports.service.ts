import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../products/entities/product.entity';
import { DateRangeDto } from '../../common/dto/date-range.dto';
import { DeletedPercentageReportDto } from '../dto/deleted-percentage.report.dto';
import { WithOrWithoutPriceReportDto } from '../dto/with-or-without-price-percentage.report.dto';
import { TopBrandReportDto } from '../dto/top-brand-percentage.report.dto';
import {
  Between,
  FindOptionsWhere,
  IsNull,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getDeletedPercentage(): Promise<DeletedPercentageReportDto> {
    const total = await this.productRepo.count();
    if (total === 0) return { deletedPercentage: 0, notDeletedPercentage: 0 };

    const deleted = await this.productRepo.count({
      withDeleted: true,
      where: { deletedAt: Not(IsNull()) },
    });

    const deletedPercentage = (deleted / total) * 100;
    const notDeletedPercentage = 100 - Number(deletedPercentage);

    return { deletedPercentage, notDeletedPercentage };
  }

  async getWithOrWithoutPrice(dateRange?: DateRangeDto): Promise<WithOrWithoutPriceReportDto> {
    const baseWhere: FindOptionsWhere<Product> = { deletedAt: IsNull() };

    if (dateRange?.startDate && dateRange?.endDate) {
      baseWhere.createdAt = Between(new Date(dateRange.startDate), new Date(dateRange.endDate));
    } else if (dateRange?.startDate) {
      baseWhere.createdAt = MoreThanOrEqual(new Date(dateRange.startDate));
    } else if (dateRange?.endDate) {
      baseWhere.createdAt = LessThanOrEqual(new Date(dateRange.endDate));
    }

    const total = await this.productRepo.count({ where: baseWhere });
    if (total === 0) {
      return { withPricePercentage: 0, withoutPricePercentage: 0 };
    }

    const withPrice = await this.productRepo.count({
      where: { ...baseWhere, price: MoreThan(0) },
    });

    const withoutPrice = total - withPrice;

    return {
      withPricePercentage: (withPrice / total) * 100,
      withoutPricePercentage: (withoutPrice / total) * 100,
    };
  }

  async getTopBrands(): Promise<TopBrandReportDto[]> {
    const brands = await this.productRepo.find({
      select: ['brand'],
      where: { deletedAt: IsNull() },
    });

    const total = brands.length;
    if (total === 0) return [];

    const counts = brands.reduce<Record<string, number>>((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {});

    const brandsSorted = Object.entries(counts)
      .map(([brand, totalProducts]) => ({
        brand,
        totalProducts,
        percentage: Number((totalProducts / total) * 100),
      }))
      .sort((a, b) => b.totalProducts - a.totalProducts);

    return brandsSorted;
  }
}
