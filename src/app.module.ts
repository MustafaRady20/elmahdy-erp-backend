import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { EmpRevenueModule } from './emp-revenue/emp-revenue.module';
import { CafeModule } from './cafe/cafe.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ReviewModule } from './reviews/reviews.module';
import { ReservationModule } from './reservations/reservations.module';
import { ReservationService } from './reservations/reservations.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow('DATABASE_HOST'),
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    EmployeesModule,
    ReservationModule,
    ReviewModule,
    EmpRevenueModule,
    CafeModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
