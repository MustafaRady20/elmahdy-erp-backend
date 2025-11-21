import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cafe, CafeDocument } from './schema/cafe.schema';

export class CreateCafeDto {
  name: string;
  description?: string;
  branch: string;
}

export class UpdateCafeDto {
  name?: string;
  description?: string;
  branch?: string;
}

@Injectable()
export class CafeService {
  constructor(@InjectModel(Cafe.name) private cafeModel: Model<CafeDocument>) {}

  async create(createCafeDto: CreateCafeDto): Promise<Cafe> {
    const cafe = new this.cafeModel(createCafeDto);
    return cafe.save();
  }

  async findAll(): Promise<Cafe[]> {
    return this.cafeModel.find().exec();
  }

  async findByBranch(branch: string): Promise<Cafe[]> {
    return this.cafeModel.find({ branch }).exec();
  }

  async findOne(id: string): Promise<Cafe> {
    const cafe = await this.cafeModel.findById(id).exec();
    if (!cafe) {
      throw new NotFoundException(`Cafe with ID ${id} not found`);
    }
    return cafe;
  }

  async update(id: string, updateCafeDto: UpdateCafeDto): Promise<Cafe> {
    const cafe = await this.cafeModel
      .findByIdAndUpdate(id, updateCafeDto, { new: true })
      .exec();
    if (!cafe) {
      throw new NotFoundException(`Cafe with ID ${id} not found`);
    }
    return cafe;
  }

  async remove(id: string): Promise<void> {
    const result = await this.cafeModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Cafe with ID ${id} not found`);
    }
  }

  async getBranches(): Promise<string[]> {
    const branches = await this.cafeModel.distinct('branch').exec();
    return branches;
  }
}