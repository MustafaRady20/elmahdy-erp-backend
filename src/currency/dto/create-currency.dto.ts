import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ example: 'USD' })
  @IsOptional()
  @IsString()
  code: string;

  @ApiProperty({ example: 'US Dollar' })
  @IsString()
  name: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  exchangeRate: number;
}
