import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CafeRevenueDocument = CafeRevenue & Document;

@Schema({ timestamps: true })
export class CafeRevenue {
  @Prop({ type: Types.ObjectId, ref: "Cafe", required: true })
  cafeId: Types.ObjectId;

  @Prop({ required: true })
  shift: string; // example: "morning", "evening"

  @Prop({ required: true })
  date: Date; // revenue date

  @Prop({ required: true })
  amount: number; // revenue amount for the shift on that day
}

export const CafeRevenueSchema = SchemaFactory.createForClass(CafeRevenue);
