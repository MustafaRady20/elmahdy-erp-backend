import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schema/reservation.schema';
import { ReservationController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    WhatsappModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationModule {}
