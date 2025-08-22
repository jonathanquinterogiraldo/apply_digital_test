import { Expose, Transform } from 'class-transformer';
import { formatPercentage } from 'src/reports/common/formatPercentage';

export class WithOrWithoutPriceReportDto {
  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  withPricePercentage: number;

  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  withoutPricePercentage: number;
}
