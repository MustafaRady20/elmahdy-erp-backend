import { IsString, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}

import { PartialType } from '@nestjs/mapped-types';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {}

