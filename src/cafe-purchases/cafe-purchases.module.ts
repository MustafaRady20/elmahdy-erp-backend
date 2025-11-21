import { Module } from '@nestjs/common';
import { CafePurchaseService } from './cafe-purchases.service';
import { CafePurchaseController } from './cafe-purchases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CafePurchase, CafePurchaseSchema } from './schema/purchase.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{
      name:CafePurchase.name,schema:CafePurchaseSchema
    }])
  ],
  providers: [CafePurchaseService],
  controllers: [CafePurchaseController]
})
export class CafePurchasesModule {}
