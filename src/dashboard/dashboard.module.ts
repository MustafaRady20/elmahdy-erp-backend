import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpRevenue, RevenueSchema } from '../emp-revenue/schema/revenue.schema';
import { Employees, EmployeesSchema } from '../employees/schema/employee.schema';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmpRevenue.name, schema: RevenueSchema },
      { name: Employees.name, schema: EmployeesSchema },
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
