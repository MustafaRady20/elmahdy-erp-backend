import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsMongoId, IsOptional, IsEnum } from "class-validator";

export enum PeriodType {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export class FilterPurchasesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  cafeId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  branchId?: string;

  @ApiPropertyOptional({ enum: PeriodType })
  @IsOptional()
  @IsEnum(PeriodType)
  period?: PeriodType;

  @ApiPropertyOptional({ example: "2025-01-01" })
  @IsOptional()
  from?: string;

  @ApiPropertyOptional({ example: "2025-01-31" })
  @IsOptional()
  to?: string;
}
