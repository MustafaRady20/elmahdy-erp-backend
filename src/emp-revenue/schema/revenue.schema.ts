import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmpRevenueDocument = EmpRevenue & Document;

@Schema({ timestamps: true })
export class EmpRevenue {
  @Prop({ required: true, enum: ['luggage', 'cleaning'] })
  type: 'luggage' | 'cleaning';

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Date, default: new Date})
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
  employee: Types.ObjectId; 
}

export const RevenueSchema = SchemaFactory.createForClass(EmpRevenue);
