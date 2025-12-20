import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type CafePurchaseDocument = CafePurchase & Document;
@Schema({ timestamps: true })
export class CafePurchase {
  @Prop({ type: Types.ObjectId, ref: 'Cafe', required: true })
  cafeId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalCost: number;

  @Prop({ required: true })
  purchaseDate: Date;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CafePurchaseSchema = SchemaFactory.createForClass(CafePurchase);

CafePurchaseSchema.index({ cafeId: 1, branchId: 1, purchaseDate: -1 });

CafePurchaseSchema.pre('save', function (next) {
  this.totalCost = this.quantity * this.unitPrice;
  next();
});
