import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Category, CategoryDocument } from "./schema/category.shcema";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";


@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = new this.categoryModel(createCategoryDto);
    return category.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const updated = await this.categoryModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException("Category not found");
    }

    return updated;
  }

  async remove(id: string): Promise<string> {
    const deleted = await this.categoryModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException("Category not found");
    }

    return "Category deleted successfully";
  }
}
