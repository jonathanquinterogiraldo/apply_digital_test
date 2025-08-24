import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { formatPercentage } from 'src/reports/common/formatPercentage';

export class WithOrWithoutPriceReportDto {
  @ApiProperty({
    description: 'Percentage of items that have a price (formatted as string with %)',
    example: '80%',
  })
  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  withPricePercentage: number;

  @ApiProperty({
    description: 'Percentage of items that do not have a price (formatted as string with %)',
    example: '20%',
  })
  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  withoutPricePercentage: number;
}
