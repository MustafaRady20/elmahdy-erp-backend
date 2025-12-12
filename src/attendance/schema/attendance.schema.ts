import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Types } from 'mongoose';

export type AttendanceDocument = Attendance & Document

@Schema({ timestamps: true })
export class Attendance  {
  @Prop({ type: Types.ObjectId, ref: "Employees", required: true })
  employeeId: Types.ObjectId;

  @Prop({ required: true })
  checkInTime: Date;

  @Prop()
  checkOutTime?: Date;

  @Prop()
  totalHours?: number;

  @Prop()
  checkInLocation: string;

  @Prop()
  checkOutLocation?: string;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
