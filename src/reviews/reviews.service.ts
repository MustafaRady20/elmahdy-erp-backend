// review.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schema/reviews.schema';
import { CreateReviewDto, UpdateReviewDto } from './dto/reviews.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = new this.reviewModel(createReviewDto);
    return review.save();
  }

  async findAll(): Promise<Review[]> {
    return this.reviewModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewModel.findById(id).exec();
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async update(id: string, updateDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async remove(id: string): Promise<void> {
    const result = await this.reviewModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Review not found');
  }
}
