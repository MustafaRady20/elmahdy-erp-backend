import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CafePurchaseDocument = CafePurchase & Document;

@Schema({ timestamps: true })
export class CafePurchase {
  @Prop({ type: Types.ObjectId, ref: "Cafe", required: true })
  cafeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Category" })
  category: Types.ObjectId; 

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalCost: number;
}

export const CafePurchaseSchema = SchemaFactory.createForClass(CafePurchase);
