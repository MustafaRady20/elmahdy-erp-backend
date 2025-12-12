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
import {
  CreateEmpRevenueDto,
  UpdateEmpRevenueDto,
} from './dto/emp-revenue.dto';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Employee Revenue')
@Controller('emp-revenue')
export class EmpRevenueController {
  constructor(private readonly service: EmpRevenueService) {}

  @Post()
  @ApiOperation({ summary: 'Create revenue entry for employee and activity' })
  @ApiResponse({
    status: 201,
    description: 'Revenue record created successfully',
  })
  create(@Body() dto: CreateEmpRevenueDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all revenue records with activity and employee populated',
  })
  @ApiResponse({ status: 200, description: 'List of all revenue records' })
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update specific revenue entry by ID' })
  @ApiParam({ name: 'id', description: 'Revenue Record ID' })
  @ApiResponse({ status: 200, description: 'Record updated' })
  update(@Param('id') id: string, @Body() dto: UpdateEmpRevenueDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete revenue entry' })
  @ApiParam({ name: 'id', description: 'Revenue Record ID' })
  @ApiResponse({ status: 200, description: 'Record deleted' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Get('report')
  @ApiOperation({
    summary: 'Generate revenue report (daily/weekly/monthly/yearly)',
  })
  @ApiQuery({
    name: 'period',
    required: false,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    example: 'monthly',
  })
  @ApiResponse({ status: 200, description: 'Revenue analytics result' })
  report(
    @Query('period')
    period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly',
  ) {
    return this.service.report(period);
  }
  @Get('employee/:id')
  @ApiOperation({ summary: 'Get all revenue details for a specific employee' })
  @ApiParam({ name: 'id', description: 'Employee ID' })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  findByEmployee(
    @Param('id') employeeId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.service.findByEmployee(employeeId, +page, +limit);
  }
}
