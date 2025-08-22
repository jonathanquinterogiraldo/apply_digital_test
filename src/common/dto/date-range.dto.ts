import { IsOptional, IsDateString } from 'class-validator';
import { IsValidDateRange } from '../decorators/is-valid-date-range.decorator';

@IsValidDateRange()
export class DateRangeDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
