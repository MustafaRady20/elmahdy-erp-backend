import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RuleDocument, Rules } from './schema/rules.schema';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';

@Injectable()
export class RulesService {
  constructor(@InjectModel(Rules.name) private readonly rulesModel: Model<RuleDocument>) {}

  async create(createRuleDto: CreateRuleDto): Promise<Rules> {
    const createdRule = new this.rulesModel(createRuleDto);
    return createdRule.save();
  }

  async findAll(): Promise<Rules[]> {
    return this.rulesModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Rules> {
    const rule = await this.rulesModel.findById(id).exec();
    if (!rule) throw new NotFoundException(`Rule with ID ${id} not found`);
    return rule;
  }

  async update(id: string, updateRuleDto: UpdateRuleDto): Promise<Rules> {
    const updated = await this.rulesModel.findByIdAndUpdate(id, updateRuleDto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Rule with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const result = await this.rulesModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Rule with ID ${id} not found`);
  }
}
