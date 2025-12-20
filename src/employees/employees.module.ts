import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employees, EmployeesSchema } from './schema/employee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employees.name, schema: EmployeesSchema },
    ]),
    CloudinaryModule,
    MailModule
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService,CloudinaryService],
})
export class EmployeesModule {}
