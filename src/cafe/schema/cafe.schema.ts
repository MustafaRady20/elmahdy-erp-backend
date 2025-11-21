import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CafeDocument = Cafe & Document;

@Schema({ timestamps: true })
export class Cafe {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: true })
  branch: string;
}

export const CafeSchema = SchemaFactory.createForClass(Cafe);
