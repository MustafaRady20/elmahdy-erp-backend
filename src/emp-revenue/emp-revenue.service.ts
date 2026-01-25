import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmpRevenue, EmpRevenueDocument } from './schema/revenue.schema';
import {
  CreateEmpRevenueDto,
  UpdateEmpRevenueDto,
} from './dto/emp-revenue.dto';
import { Currency, CurrencyDocument } from 'src/currency/shcema/currency.schema';

@Injectable()
export class EmpRevenueService {
  constructor(
    @InjectModel(EmpRevenue.name)
    private readonly model: Model<EmpRevenueDocument>,
     @InjectModel(Currency.name)
    private readonly currencyModel: Model<CurrencyDocument>
  ) {}

async create(dto: CreateEmpRevenueDto) {
  const currency = await this.currencyModel.findById(dto.currency);

  if (!currency) {
    throw new NotFoundException('Currency not found');
  }
  const EGPamount = dto.amount * currency.exchangeRate;

  return this.model.create({
    activity: new Types.ObjectId(dto.activity),
    employee: new Types.ObjectId(dto.employee),
    currency: new Types.ObjectId(dto.currency),

    amount: dto.amount,        
    EGPamount,                  
    date: dto.date ?? new Date(),
  });
}


  async findAll() {
    return this.model
      .find()
      .populate('activity')
      .populate('employee')
      .populate('currency')
      .exec();
  }

  async update(id: string, dto: UpdateEmpRevenueDto) {
  const existing = await this.model.findById(id);

  if (!existing) {
    throw new NotFoundException('Record not found');
  }

  const amount = dto.amount ?? existing.amount;
  const currencyId = dto.currency ?? existing.currency;

  const currency = await this.currencyModel.findById(currencyId);
  if (!currency) {
    throw new NotFoundException('Currency not found');
  }

  const EGPamount = amount * currency.exchangeRate;

  const record = await this.model.findByIdAndUpdate(
    id,
    {
      ...dto,
      amount,
      currency: currencyId,
      EGPamount,
    },
    { new: true },
  );

  return record;
}


  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  // ---------------- REPORTS ---------------- //

  private getDateRange(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    year?: number,
    month?: number,
    date?: Date,
  ) {
    const now = new Date();
    let start: Date;
    let end: Date;

    // If specific date is provided, use that
    if (date) {
      start = new Date(date);
      start.setHours(0, 0, 0, 0);
      end = new Date(date);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }

    // If year and month are provided
    if (year && month) {
      start = new Date(year, month - 1, 1); // month is 1-indexed in the input
      end = new Date(year, month, 0, 23, 59, 59, 999); // last day of the month
      return { start, end };
    }

    // If only year is provided
    if (year) {
      start = new Date(year, 0, 1);
      end = new Date(year, 11, 31, 23, 59, 59, 999);
      return { start, end };
    }

    // Otherwise use the period
    switch (period) {
      case 'daily':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          23,
          59,
          59,
          999,
        );
        break;
      case 'weekly':
        const day = now.getDay();
        start = new Date(now);
        start.setDate(now.getDate() - day);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        break;
      case 'yearly':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
    }

    return { start, end };
  }

  async report(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    year?: number,
    month?: number,
    date?: string,
  ) {
    const parsedDate = date ? new Date(date) : undefined;
    const { start, end } = this.getDateRange(period, year, month, parsedDate);

    const match = { date: { $gte: start, $lte: end } };

    const totalRevenue = await this.model.aggregate([
      { $match: match },
      { $group: { _id: null, totalRevenue: {$sum: '$EGPamount' } } },
    ]);

    const revenueByEmployee = await this.model.aggregate([
      { $match: match },
      { $group: { _id: '$employee', total: { $sum: '$EGPamount' } } },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employee',
        },
      },
      { $unwind: '$employee' },
      { $sort: { total: -1 } }, // Sort by total revenue descending
    ]);

    const revenueByActivity = await this.model.aggregate([
      { $match: match },
      { $group: { _id: '$activity', total: { $sum: '$EGPamount' } } },
      {
        $lookup: {
          from: 'activities',
          localField: '_id',
          foreignField: '_id',
          as: 'activity',
        },
      },
      { $unwind: '$activity' },
      { $sort: { total: -1 } }, // Sort by total revenue descending
    ]);

    return {
      period,
      filters: {
        year,
        month,
        date,
      },
      dateRange: {
        start,
        end,
      },
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
      .populate('currency')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }
}
