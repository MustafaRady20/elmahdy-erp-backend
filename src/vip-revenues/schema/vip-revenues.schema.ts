import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

export type VipRevenueDocument = VipRevenue & Document

@Schema({timestamps:true})
export class VipRevenue {  
    
     @Prop({ required: true })
      serialNumber: string;

      @Prop({ required: true })
      amount: number;
    
      @Prop({ type: Date, default: Date.now })
      date: Date;
    
      @Prop({ type: Types.ObjectId, ref: 'Employees', required: true })
      employee: Types.ObjectId;
}


export const VupRevenueSchema = SchemaFactory.createForClass(VipRevenue)