import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsValidDateRange } from '../decorators/is-valid-date-range.decorator';

@IsValidDateRange()
export class DateRangeDto {
  @ApiPropertyOptional({
    description: 'Start date for the report (inclusive, format: YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for the report (inclusive, format: YYYY-MM-DD)',
    example: '2025-01-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
