import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpRevenueController } from './emp-revenue.controller';
import { EmpRevenueService } from './emp-revenue.service';
import { EmpRevenue, RevenueSchema } from './schema/revenue.schema';

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
