import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmpRevenue, RevenueSchema } from './schema/revenue.schema';
import { EmpRevenueService } from './emp-revenue.service';
import { EmpRevenueController } from './emp-revenue.controller';
import { CurrencyModule } from 'src/currency/currency.module';
import { Currency, CurrencySchema } from 'src/currency/shcema/currency.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmpRevenue.name, schema: RevenueSchema },
      { name: Currency.name, schema: CurrencySchema },
    ]),
     ],
  controllers: [EmpRevenueController],
  providers: [EmpRevenueService,],
  exports: [EmpRevenueService],
})
export class EmpRevenueModule {}
