import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { formatPercentage } from 'src/reports/common/formatPercentage';

export class DeletedPercentageReportDto {
  @ApiProperty({
    description: 'Percentage of deleted items (formatted as string with %)',
    example: '25%',
  })
  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  deletedPercentage: number;

  @ApiProperty({
    description: 'Percentage of not deleted items (formatted as string with %)',
    example: '75%',
  })
  @Expose()
  @Transform(({ value }: { value: number }) => formatPercentage(value))
  notDeletedPercentage: number;
}
