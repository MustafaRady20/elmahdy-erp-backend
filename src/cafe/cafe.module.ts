import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CafeController } from './cafe.controller';
import { CafeService } from './cafe.service';
import { Cafe, CafeSchema } from './schema/cafe.schema';
import { BranchesModule } from './branches/branches.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cafe.name, schema: CafeSchema }]),
    BranchesModule,
  ],
  controllers: [CafeController],
  providers: [CafeService],
  exports: [CafeService],
})
export class CafeModule {}