import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type RuleDocument = Rules & Document;

@Schema({ timestamps: true })
export class Rules {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, enum: ['rule', 'instruction'], default: 'rule' })
  type: 'rule' | 'instruction';
}

export const RulesSchema = SchemaFactory.createForClass(Rules);
