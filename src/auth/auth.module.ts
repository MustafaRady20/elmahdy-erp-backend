import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Employees, EmployeesSchema } from 'src/employees/schema/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Employees.name, schema: EmployeesSchema }]),
    JwtModule.register({
      secret: process.env.SECRET_JWT_KEY, 
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
