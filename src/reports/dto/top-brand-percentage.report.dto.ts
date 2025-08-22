import { Expose, Transform } from 'class-transformer';
import { formatPercentage } from 'src/reports/common/formatPercentage';

export class TopBrandReportDto {
  @Expose()
  brand: string;

  @Expose()
  totalProducts: number;

  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  percentage: number;
}
