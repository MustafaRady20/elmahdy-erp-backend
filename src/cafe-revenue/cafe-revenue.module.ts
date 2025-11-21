import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { CafeRevenueService } from "./cafe-revenue.service";
import { CafeRevenueController } from "./cafe-revenue.controller";
import { CafeRevenue, CafeRevenueSchema } from "./schema/cafe-revenue.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CafeRevenue.name, schema: CafeRevenueSchema },
    ]),
  ],
  providers: [CafeRevenueService],
  controllers: [CafeRevenueController],
})
export class CafeRevenueModule {}
