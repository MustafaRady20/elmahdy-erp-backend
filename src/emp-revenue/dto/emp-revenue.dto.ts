import { IsNotEmpty, IsOptional, IsNumber, IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmpRevenueDto {
  @ApiProperty({ example: '677f133bbdc12f45b8c1d9a1' })
  @IsMongoId()
  @IsNotEmpty()
  activity: string;

  @ApiProperty({ example: '677f134bbdc12f45b8c1d9b2' })
  @IsMongoId()
  @IsNotEmpty()
  employee: string;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ example: '2025-11-20', required: false })
  @IsOptional()
  date?: Date;
}

export class UpdateEmpRevenueDto {
  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  activity?: string;

  @ApiProperty({ required: false })
  @IsMongoId()
  @IsOptional()
  employee?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  date?: Date;
}
