import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type EmpRevenueDocument = EmpRevenue & Document;

@Schema({ timestamps: true })
export class EmpRevenue {
  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  activity: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Employees', required: true })
  employee: Types.ObjectId;
}

export const RevenueSchema = SchemaFactory.createForClass(EmpRevenue);
