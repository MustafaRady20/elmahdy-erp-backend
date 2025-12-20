import { Module } from '@nestjs/common';
import { BranchService } from './branches.service';
import { BranchController } from './branches.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from './schema/branch.schema';
@Module({
  imports:[MongooseModule.forFeature([{name:Branch.name,schema:BranchSchema}])],
  providers: [BranchService],
  controllers: [BranchController]
})
export class BranchesModule {}
