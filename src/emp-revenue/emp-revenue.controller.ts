import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { EmpRevenueService } from './emp-revenue.service';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CreateEmpRevenueDto, UpdateEmpRevenueDto } from './dto/emp-revenue.dto';

@ApiTags('Employee Revenue')
@Controller('emp-revenue')
export class EmpRevenueController {
  constructor(private readonly revenueService: EmpRevenueService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new employee revenue record' })
  create(@Body() dto: CreateEmpRevenueDto) {
    return this.revenueService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all revenue records' })
  findAll() {
    return this.revenueService.findAll();
  }

  @Get('employee/:id')
  @ApiOperation({ summary: 'Get revenue records by employee' })
  @ApiParam({ name: 'id', example: '677f1234bdc12f45b8c1d111' })
  findByEmployee(@Param('id') employeeId: string) {
    return this.revenueService.findByEmployee(employeeId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get revenue record by ID' })
  findOne(@Param('id') id: string) {
    return this.revenueService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a revenue record' })
  update(@Param('id') id: string, @Body() dto: UpdateEmpRevenueDto) {
    return this.revenueService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a revenue record' })
  delete(@Param('id') id: string) {
    return this.revenueService.delete(id);
  }

  // ============================
  // REPORTING ENDPOINTS
  // ============================

  @Get('report/daily')
  @ApiOperation({ summary: 'Get daily revenue for a specific date' })
  @ApiQuery({ name: 'date', example: '2025-11-20' })
  getDaily(@Query('date') date: string) {
    return this.revenueService.getDailyRevenue(date);
  }

  @Get('report/weekly')
  @ApiOperation({ summary: 'Get weekly revenue (last 7 days)' })
  getWeekly() {
    return this.revenueService.getWeeklyRevenue();
  }

  @Get('report/monthly')
  @ApiOperation({ summary: 'Get monthly revenue' })
  @ApiQuery({ name: 'year', example: 2025 })
  @ApiQuery({ name: 'month', example: 11 })
  getMonthly(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.revenueService.getMonthlyRevenue(year, month);
  }

  @Get('report/yearly')
  @ApiOperation({ summary: 'Get yearly revenue' })
  @ApiQuery({ name: 'year', example: 2025 })
  getYearly(@Query('year') year: number) {
    return this.revenueService.getYearlyRevenue(year);
  }

  // -------------------------
  // ADVANCED AGGREGATION
  // -------------------------

  @Get('report/group-by/employee')
  @ApiOperation({ summary: 'Total revenue grouped by employee' })
  aggEmployee() {
    return this.revenueService.groupByEmployee();
  }

  @Get('report/group-by/activity')
  @ApiOperation({ summary: 'Total revenue grouped by activity' })
  aggActivity() {
    return this.revenueService.groupByActivity();
  }

  @Get('report/totals')
  @ApiOperation({ summary: 'Get total sum of all revenue' })
  totals() {
    return this.revenueService.getTotalRevenue();
  }
}
