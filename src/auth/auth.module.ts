import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Employees,
  EmployeesSchema,
} from 'src/employees/schema/employee.schema';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employees.name, schema: EmployeesSchema },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('SECRET_JWT_KEY'),
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  controllers:[AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
