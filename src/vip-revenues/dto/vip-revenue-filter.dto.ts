import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsOptional, IsDateString } from 'class-validator';

export class VipRevenueFilterDto {
  @ApiPropertyOptional({ example: '66c9f1f8a0b9c3d9f0e12345' })
  @IsOptional()
  @IsMongoId()
  employee?: string;

  @ApiPropertyOptional({ example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2026-01-31' })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
