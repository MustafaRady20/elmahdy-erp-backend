import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmpRevenue, EmpRevenueDocument } from './schema/revenue.schema';
import {
  CreateEmpRevenueDto,
  UpdateEmpRevenueDto,
} from './dto/emp-revenue.dto';

@Injectable()
export class EmpRevenueService {
  constructor(
    @InjectModel(EmpRevenue.name)
    private readonly model: Model<EmpRevenueDocument>,
  ) {}

  async create(dto: CreateEmpRevenueDto) {
    return this.model.create({
      ...dto,
      activity: new Types.ObjectId(dto.activity),
      employee: new Types.ObjectId(dto.employee),
    });
  }

  async findAll() {
    console.log(
      '📌 EmpRevenue Collection Name:',
      this.model.collection.collectionName,
    );

    return this.model.find().populate('activity').populate('employee').exec();
  }

  async update(id: string, dto: UpdateEmpRevenueDto) {
    const record = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  // ---------------- REPORTS ---------------- //

  private getDateRange(period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const now = new Date();
    let start: Date;

    switch (period) {
      case 'daily':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const day = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - day);
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'yearly':
        start = new Date(now.getFullYear(), 0, 1);
        break;
    }

    return { start, end: now };
  }

  async report(period: 'daily' | 'weekly' | 'monthly' | 'yearly') {
    const { start, end } = this.getDateRange(period);

    const match = { date: { $gte: start, $lte: end } };

    const totalRevenue = await this.model.aggregate([
      { $match: match },
      { $group: { _id: null, totalRevenue: { $sum: '$amount' } } },
    ]);

    const revenueByEmployee = await this.model.aggregate([
      { $match: match },
      { $group: { _id: '$employee', total: { $sum: '$amount' } } },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
    ]);

    const revenueByActivity = await this.model.aggregate([
      { $match: match },
      { $group: { _id: '$activity', total: { $sum: '$amount' } } },
      {
        $lookup: {
          from: 'activities',
          localField: '_id',
          foreignField: '_id',
          as: 'activity',
        },
      },
      { $unwind: '$activity' },
    ]);

    return {
      period,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      revenueByEmployee,
      revenueByActivity,
    };
  }
async findByEmployee(employeeId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  const total = await this.model.countDocuments({
    employee: new Types.ObjectId(employeeId),
  });

  const data = await this.model
    .find({ employee: new Types.ObjectId(employeeId) })
    .populate('activity')
    .populate('employee')
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    total,
    totalPages,
    page,
    limit,
  };
}

}
