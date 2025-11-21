import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmpRevenue, EmpRevenueDocument } from './schema/revenue.schema';
import {
  CreateEmpRevenueDto,
  UpdateEmpRevenueDto,
} from './dto/emp-revenue.dto';

@Injectable()
export class EmpRevenueService {
  constructor(
    @InjectModel(EmpRevenue.name)
    private readonly revenueModel: Model<EmpRevenueDocument>,
  ) {}

  async create(dto: CreateEmpRevenueDto) {
    return this.revenueModel.create(dto);
  }

  async findAll() {
    return this.revenueModel
      .find()
      .populate('activity')
      .populate('employee')
      .sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const record = await this.revenueModel
      .findById(id)
      .populate('activity')
      .populate('employee');

    if (!record) throw new NotFoundException('Revenue record not found');

    return record;
  }

  async findByEmployee(employeeId: string) {
    return this.revenueModel
      .find({ employee: employeeId })
      .populate('activity')
      .sort({ createdAt: -1 });
  }

  async update(id: string, dto: UpdateEmpRevenueDto) {
    const updated = await this.revenueModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) throw new NotFoundException('Revenue record not found');

    return updated;
  }

  async delete(id: string) {
    const deleted = await this.revenueModel.findByIdAndDelete(id);

    if (!deleted) throw new NotFoundException('Revenue record not found');

    return deleted;
  }

  // -----------------------------
  // REPORTS (Daily, Weekly, Monthly, Yearly)
  // -----------------------------

  async getDailyRevenue(date: string) {
    const targetDate = new Date(date);
    const start = new Date(targetDate.setHours(0, 0, 0, 0));
    const end = new Date(targetDate.setHours(23, 59, 59, 999));

    return this.revenueModel.find({
      date: { $gte: start, $lte: end },
    });
  }

  async getWeeklyRevenue() {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);

    return this.revenueModel.find({
      date: { $gte: start, $lte: end },
    });
  }

  async getMonthlyRevenue(year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59, 999);

    return this.revenueModel.find({
      date: { $gte: start, $lte: end },
    });
  }

  async getYearlyRevenue(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);

    return this.revenueModel.find({
      date: { $gte: start, $lte: end },
    });
  }

  async groupByEmployee() {
    return this.revenueModel.aggregate([
      {
        $group: {
          _id: '$employee',
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
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
  }
  async groupByActivity() {
    return this.revenueModel.aggregate([
      {
        $group: {
          _id: '$activity',
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
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
  }

  async getTotalRevenue() {
    const result = await this.revenueModel.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return result[0] || { totalRevenue: 0, count: 0 };
  }
}
