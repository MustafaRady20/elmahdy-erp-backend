import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SalaryService } from './salaries.service';

@ApiTags('Salary')
@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Get()
  @ApiOperation({ summary: 'الحصول على رواتب الموظفين محسوبة آلياً' })
  async getSalaries() {
    return this.salaryService.calculateSalaries();
  }
}
