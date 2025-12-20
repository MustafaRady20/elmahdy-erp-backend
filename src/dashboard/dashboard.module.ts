import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmpRevenue,
  RevenueSchema,
} from '../emp-revenue/schema/revenue.schema';
import {
  Employees,
  EmployeesSchema,
} from '../employees/schema/employee.schema';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { CafePurchase, CafePurchaseSchema } from 'src/cafe-purchases/schema/purchase.schema';
import { CafeRevenue, CafeRevenueSchema } from 'src/cafe-revenue/schema/cafe-revenue.schema';
import { Reservation, ReservationSchema } from 'src/reservations/schema/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmpRevenue.name, schema: RevenueSchema },
      { name: Employees.name, schema: EmployeesSchema },
      { name: CafePurchase.name, schema: CafePurchaseSchema },
      { name: CafeRevenue.name, schema: CafeRevenueSchema },
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
