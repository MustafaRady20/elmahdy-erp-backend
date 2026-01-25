import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type EmployeesDocument = Employees & Document;

export enum EmployeeRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  SUPERVISOR = 'supervisor',
}

@Schema({ timestamps: true ,collection:"employees"})
export class Employees {
  _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ trim: true })
  email?: string;

  @Prop()
  birthdate?: string;

  @Prop({ trim: true })
  nationalId?: string;

  @Prop({ trim: true })
  address?: string;

  @Prop({ required: false })
  password: string;

  @Prop({ enum: EmployeeRole, default: EmployeeRole.EMPLOYEE })
  role: EmployeeRole;

  @Prop({ required: true, enum: ['fixed', 'variable'] })
  type: 'fixed' | 'variable';

  @Prop({ required: false, default: 0 })
  fixedSalary?: number;
  
  @Prop({ default: true })
  firstLogin: boolean;
  
  @Prop({
    type: [
      {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        typeOfRelation: { type: String, required: true },
      },
    ],
    default: [],
  })
  relativesInfo?: {
    name: string;
    phone: string;
    typeOfRelation: string;
  }[];

  @Prop({
    type: {
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
      permitImage: { type: String, required: false },
    },
  })
  permitInfo?: {
    startDate?: Date;
    endDate?: Date;
    permitImage?: string;
  };

  @Prop()
  nationalIdImage?: string; // صورة الرقم القومي

  @Prop({enum:["active","inActive"],default:"active"})
  status?: string; 

  @Prop()
  militaryServiceCertificateImage?: string; // صورة شهادة الخدمة العسكرية

  @Prop({required: false})
  profileImage?: string; // صورة شخصية للموظف
}

export const EmployeesSchema = SchemaFactory.createForClass(Employees);
