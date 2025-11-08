import { Module } from '@nestjs/common';
import { EmpRevenueService } from './emp-revenue.service';
import { EmpRevenueController } from './emp-revenue.controller';

@Module({
  providers: [EmpRevenueService],
  controllers: [EmpRevenueController]
})
export class EmpRevenueModule {}
