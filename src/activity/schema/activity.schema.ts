import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ActivityDocument = Activity & Document;

@Schema({ timestamps: true,collection:"activities" })
export class Activity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
