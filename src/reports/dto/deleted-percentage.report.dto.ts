import { Expose, Transform } from 'class-transformer';
import { formatPercentage } from 'src/reports/common/formatPercentage';

export class DeletedPercentageReportDto {
  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  deletedPercentage: number;

  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  notDeletedPercentage: number;
}
