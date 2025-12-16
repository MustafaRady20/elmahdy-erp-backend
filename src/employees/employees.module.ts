import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employees, EmployeesSchema } from './schema/employee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employees.name, schema: EmployeesSchema },
    ]),
    CloudinaryModule
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService,CloudinaryService],
})
export class EmployeesModule {}
