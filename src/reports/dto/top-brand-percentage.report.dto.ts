import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { formatPercentage } from 'src/reports/common/formatPercentage';

export class TopBrandReportDto {
  @ApiProperty({
    description: 'Brand name',
    example: 'Samsung',
  })
  @Expose()
  brand: string;

  @ApiProperty({
    description: 'Total number of products for this brand',
    example: 120,
  })
  @Expose()
  totalProducts: number;

  @ApiProperty({
    description:
      'Percentage of products for this brand relative to the total (formatted as string with %)',
    example: '35%',
  })
  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  percentage: number;
}
