import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity, ActivityDocument } from './schema/activity.schema';
import { CreateActivityDto, UpdateActivityDto } from './schema/dto/activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(Activity.name)
    private activityModel: Model<ActivityDocument>,
  ) {}

  async create(dto: CreateActivityDto) {
    return await this.activityModel.create(dto);
  }

  async findAll() {
    return await this.activityModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const activity = await this.activityModel.findById(id);
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async update(id: string, dto: UpdateActivityDto) {
    const updated = await this.activityModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('Activity not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.activityModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Activity not found');
    return deleted;
  }
}
