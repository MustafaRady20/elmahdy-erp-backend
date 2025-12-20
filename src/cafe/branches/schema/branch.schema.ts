import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type BranchDocument = Branch & Document;
@Schema({ timestamps: true })
export class Branch {
 @Prop({required:true})
 name:string
}

export const BranchSchema = SchemaFactory.createForClass(Branch);

