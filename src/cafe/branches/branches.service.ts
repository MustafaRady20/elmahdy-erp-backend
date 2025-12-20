// branch.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch, BranchDocument } from './schema/branch.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name)
    private readonly branchModel: Model<BranchDocument>,
  ) {}

  async create(name: string) {
    const branch = new this.branchModel({ name });
    return branch.save();
  }

  async findAll() {
    return this.branchModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const branch = await this.branchModel.findById(id);
    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async update(id: string, name: string) {
    const branch = await this.branchModel.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );

    if (!branch) throw new NotFoundException('Branch not found');
    return branch;
  }

  async remove(id: string) {
    const branch = await this.branchModel.findByIdAndDelete(id);
    if (!branch) throw new NotFoundException('Branch not found');
    return { message: 'Branch deleted successfully' };
  }
}
