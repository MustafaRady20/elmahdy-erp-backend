import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpRevenue, RevenueSchema } from './schema/revenue.schema';
import { EmpRevenueService } from './emp-revenue.service';
import { EmpRevenueController } from './emp-revenue.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmpRevenue.name, schema: RevenueSchema },
    ]),
  ],
  controllers: [EmpRevenueController],
  providers: [EmpRevenueService],
  exports: [EmpRevenueService],
})
export class EmpRevenueModule {}
