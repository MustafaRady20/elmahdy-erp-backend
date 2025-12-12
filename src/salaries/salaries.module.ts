import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpRevenue, RevenueSchema } from 'src/emp-revenue/schema/revenue.schema';
import { Employees, EmployeesSchema } from 'src/employees/schema/employee.schema';
import { SalaryController } from './salaries.controller';
import { SalaryService } from './salaries.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmpRevenue.name, schema: RevenueSchema },
      { name: Employees.name, schema: EmployeesSchema },
    ]),
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}
