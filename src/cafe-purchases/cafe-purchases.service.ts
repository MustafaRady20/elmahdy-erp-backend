import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { CreateCafePurchaseDto } from './dto/create-purchase.dto';
import { UpdateCafePurchaseDto } from './dto/update-purchase.dto';
import { CafePurchase, CafePurchaseDocument } from './schema/purchase.schema';
import { FilterPurchasesDto } from './dto/filter-purchases.dto';

@Injectable()
export class CafePurchaseService {
  constructor(
    @InjectModel(CafePurchase.name)
    private purchaseModel: Model<CafePurchaseDocument>,
  ) {}

  async create(dto: CreateCafePurchaseDto): Promise<CafePurchase> {
    const created = new this.purchaseModel(dto);
    return created.save();
  }

  async findAll(): Promise<CafePurchase[]> {
    return this.purchaseModel
      .find()
      .populate('cafeId')
      .populate('category')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<CafePurchase> {
    const purchase = await this.purchaseModel
      .findById(id)
      .populate('cafeId')
      .populate('category')
      .exec();

    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }

    return purchase;
  }

  async update(id: string, dto: UpdateCafePurchaseDto): Promise<CafePurchase> {
    const updated = await this.purchaseModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException('Purchase not found');
    }

    return updated;
  }

  async remove(id: string): Promise<string> {
    const deleted = await this.purchaseModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Purchase not found');
    }

    return 'Purchase deleted successfully';
  }
  async findWithFilters(filters: FilterPurchasesDto) {
    const query: any = { isDeleted: false };

    if (isValidObjectId(filters.cafeId)) {
      query.cafeId = new Types.ObjectId(filters.cafeId);
    }

    if (isValidObjectId(filters.branchId)) {
      query.branchId = new Types.ObjectId(filters.branchId);
    }

    if (filters.from || filters.to) {
      query.purchaseDate = {};
      if (filters.from) query.purchaseDate.$gte = new Date(filters.from);
      if (filters.to) query.purchaseDate.$lte = new Date(filters.to);
    }

    return this.purchaseModel
      .find(query)
      .populate('cafeId')
      .populate('branchId')
      .populate('category')
      .sort({ purchaseDate: -1 })
      .exec();
  }

  async getStatistics(filters: FilterPurchasesDto) {
    const match: any = { isDeleted: false };

    if (isValidObjectId(filters.cafeId)) {
      match.cafeId = new Types.ObjectId(filters.cafeId);
    }

    if (isValidObjectId(filters.branchId)) {
      match.branchId = new Types.ObjectId(filters.branchId);
    }

    if (filters.from || filters.to) {
      match.purchaseDate = {};
      if (filters.from) match.purchaseDate.$gte = new Date(filters.from);
      if (filters.to) match.purchaseDate.$lte = new Date(filters.to);
    }

    const groupBy = filters.period
      ? this.getGroupByPeriod(filters.period)
      : null;

    return this.purchaseModel.aggregate([
      { $match: match },
      {
        $group: {
          _id: groupBy,
          totalCost: { $sum: '$totalCost' },
          totalQuantity: { $sum: '$quantity' },
          avgUnitPrice: { $avg: '$unitPrice' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  private getGroupByPeriod(period: string) {
    switch (period) {
      case 'day':
        return { $dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' } };
      case 'week':
        return { $isoWeek: '$purchaseDate' };
      case 'month':
        return { $dateToString: { format: '%Y-%m', date: '$purchaseDate' } };
      case 'year':
        return { $year: '$purchaseDate' };
      default:
        return null;
    }
  }

  async getCafeStatistics(cafeId: string) {
    if (!Types.ObjectId.isValid(cafeId)) {
      throw new BadRequestException('Invalid cafeId');
    }

    const cafeObjectId = cafeId;

    // Get overall statistics
    const overallStats = await this.purchaseModel.aggregate([
      { $match: { cafeId: cafeObjectId, isDeleted: false } },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: 1 },
          totalSpent: { $sum: '$totalCost' },
          totalQuantity: { $sum: '$quantity' },
          avgOrderValue: { $avg: '$totalCost' },
          lastPurchaseDate: { $max: '$purchaseDate' },
        },
      },
    ]);

    // Get top categories
    const topCategories = await this.purchaseModel.aggregate([
      { $match: { cafeId: cafeObjectId, isDeleted: false } },
      {
        $group: {
          _id: '$category',
          totalSpent: { $sum: '$totalCost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          category: { _id: 1, name: 1 },
          totalSpent: 1,
          count: 1,
        },
      },
    ]);

    // Get monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrend = await this.purchaseModel.aggregate([
      {
        $match: {
          cafeId: cafeObjectId,
          isDeleted: false,
          purchaseDate: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$purchaseDate' },
          },
          totalCost: { $sum: '$totalCost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: '$_id',
          totalCost: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    return {
      totalPurchases: overallStats[0]?.totalPurchases || 0,
      totalSpent: overallStats[0]?.totalSpent || 0,
      totalQuantity: overallStats[0]?.totalQuantity || 0,
      averageOrderValue: overallStats[0]?.avgOrderValue || 0,
      lastPurchaseDate: overallStats[0]?.lastPurchaseDate || null,
      topCategories,
      monthlyTrend,
    };
  }
}
