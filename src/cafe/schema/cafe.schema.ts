import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CafeDocument = Cafe & Document;

@Schema({ timestamps: true })
export class Cafe {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true , ref:"Branch" })
  branch: Types.ObjectId;
}

export const CafeSchema = SchemaFactory.createForClass(Cafe);
