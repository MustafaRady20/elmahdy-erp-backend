import { Module } from '@nestjs/common';
import { RulesService } from './rules.service';
import { RulesController } from './rules.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rules, RulesSchema } from './schema/rules.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Rules.name,schema:RulesSchema
  }])],
  providers: [RulesService],
  controllers: [RulesController]
})
export class RulesModule {}
