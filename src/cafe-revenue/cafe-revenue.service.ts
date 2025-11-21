import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateRevenueDto } from "./dto/create-revenue.dto";
import { CafeRevenue, CafeRevenueDocument } from "./schema/cafe-revenue.schema";

@Injectable()
export class CafeRevenueService {
  constructor(
    @InjectModel(CafeRevenue.name)
    private revenueModel: Model<CafeRevenueDocument>,
  ) {}

  async create(dto: CreateRevenueDto) {
    const createData = new this.revenueModel({
      ...dto,
      date: new Date(dto.date),
    });
    return createData.save();
  }

  async findAll() {
    return this.revenueModel
      .find()
      .populate("cafeId")
      .sort({ date: -1 })
      .exec();
  }

  // DAILY REVENUE
  async getDailyRevenue(cafeId: string, date: string) {
    const target = new Date(date);

    return this.revenueModel.aggregate([
      {
        $match: {
          cafeId: cafeId,
          date: {
            $gte: startOfDay(target),
            $lte: endOfDay(target),
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
  }

  // WEEKLY REVENUE
  async getWeeklyRevenue(cafeId: string) {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - 7);

    return this.revenueModel.aggregate([
      {
        $match: {
          cafeId,
          date: { $gte: start, $lte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
  }

  // MONTHLY REVENUE
  async getMonthlyRevenue(cafeId: string) {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);

    return this.revenueModel.aggregate([
      {
        $match: {
          cafeId,
          date: { $gte: start, $lte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
  }

  // YEARLY REVENUE
  async getYearlyRevenue(cafeId: string) {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 1);

    return this.revenueModel.aggregate([
      {
        $match: {
          cafeId,
          date: { $gte: start, $lte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);
  }
}

// Helpers
function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function endOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
}
