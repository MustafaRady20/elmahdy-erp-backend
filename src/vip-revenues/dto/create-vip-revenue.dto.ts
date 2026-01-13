import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateVipRevenueDto {
  @ApiProperty({ example: 'VIP-2024-001' })
  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDate()
  date:Date
  
  @ApiProperty({ example: '66c9f1f8a0b9c3d9f0e12345' })
  @IsMongoId()
  employee: string;
}
