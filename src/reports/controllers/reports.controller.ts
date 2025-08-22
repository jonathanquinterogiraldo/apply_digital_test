import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { DateRangeDto } from '../../common/dto/date-range.dto';
import { DeletedPercentageReportDto } from '../dto/deleted-percentage.report.dto';
import { plainToInstance } from 'class-transformer';
import { WithOrWithoutPriceReportDto } from '../dto/with-or-without-price-percentage.report.dto';
import { TopBrandReportDto } from '../dto/top-brand-percentage.report.dto';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('deleted-percentage')
    async getDeletedPercentage(): Promise<DeletedPercentageReportDto> {
        const report = await this.reportsService.getDeletedPercentage();
        return plainToInstance(DeletedPercentageReportDto, report, { excludeExtraneousValues: true });
    }

    @Get('with-or-without-price')
    async getWithOrWithoutPrice(
        @Query() dateRange: DateRangeDto,
    ): Promise<WithOrWithoutPriceReportDto> {
        const report = await this.reportsService.getWithOrWithoutPrice(dateRange);
        return plainToInstance(WithOrWithoutPriceReportDto, report, { excludeExtraneousValues: true });
    }

    @Get('top-brand-percentage')
    async getTopBrands(): Promise<TopBrandReportDto[]> {
        const report = await this.reportsService.getTopBrands();
        return plainToInstance(TopBrandReportDto, report, { excludeExtraneousValues: true });
    }
}
