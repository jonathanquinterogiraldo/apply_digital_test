import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';
import { DateRangeDto } from '../../common/dto/date-range.dto';
import { DeletedPercentageReportDto } from '../dto/deleted-percentage.report.dto';
import { plainToInstance } from 'class-transformer';
import { WithOrWithoutPriceReportDto } from '../dto/with-or-without-price-percentage.report.dto';
import { TopBrandReportDto } from '../dto/top-brand-percentage.report.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('reports')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'))
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('deleted-percentage')
    @ApiOperation({ summary: 'Deleted percentage reprot (user registered only)' })
    async getDeletedPercentage(): Promise<DeletedPercentageReportDto> {
        const report = await this.reportsService.getDeletedPercentage();
        return plainToInstance(DeletedPercentageReportDto, report, { excludeExtraneousValues: true });
    }

    @Get('with-or-without-price')
    @ApiOperation({ summary: 'With or without price report (user registered only)' })
    async getWithOrWithoutPrice(
        @Query() dateRange: DateRangeDto,
    ): Promise<WithOrWithoutPriceReportDto> {
        const report = await this.reportsService.getWithOrWithoutPrice(dateRange);
        return plainToInstance(WithOrWithoutPriceReportDto, report, { excludeExtraneousValues: true });
    }

    @Get('top-brand-percentage')
    @ApiOperation({ summary: 'top brand percentage report (user registered only)' })
    async getTopBrands(): Promise<TopBrandReportDto[]> {
        const report = await this.reportsService.getTopBrands();
        return plainToInstance(TopBrandReportDto, report, { excludeExtraneousValues: true });
    }
}
