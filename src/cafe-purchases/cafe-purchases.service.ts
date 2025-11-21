import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateCafePurchaseDto } from "./dto/create-purchase.dto";
import { UpdateCafePurchaseDto } from "./dto/update-purchase.dto";
import { CafePurchase, CafePurchaseDocument } from "./schema/purchase.schema";

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
      .populate("cafeId")
      .populate("category")
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<CafePurchase> {
    const purchase = await this.purchaseModel
      .findById(id)
      .populate("cafeId")
      .populate("category")
      .exec();

    if (!purchase) {
      throw new NotFoundException("Purchase not found");
    }

    return purchase;
  }

  async update(id: string, dto: UpdateCafePurchaseDto): Promise<CafePurchase> {
    const updated = await this.purchaseModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException("Purchase not found");
    }

    return updated;
  }

  async remove(id: string): Promise<string> {
    const deleted = await this.purchaseModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException("Purchase not found");
    }

    return "Purchase deleted successfully";
  }
}
