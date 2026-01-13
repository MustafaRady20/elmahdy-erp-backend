import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VipRevenuesService } from './vip-revenues.service';
import { VipRevenuesController } from './vip-revenues.controller';
import { VipRevenue, VupRevenueSchema } from './schema/vip-revenues.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VipRevenue.name, schema: VupRevenueSchema },
    ]),
  ],
  controllers: [VipRevenuesController],
  providers: [VipRevenuesService],
})
export class VipRevenuesModule {}
