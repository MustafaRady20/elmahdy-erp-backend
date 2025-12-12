import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsMongoId, IsOptional } from 'class-validator';

export class CreateEmpRevenueDto {
  @ApiProperty({ example: '674f2d2b73529b7c73f765bc', description: 'Activity ID' })
  @IsNotEmpty()
  @IsMongoId()
  activity: string;

  @ApiProperty({ example: '674f2d2b73529b7c73f765cc', description: 'Employee ID' })
  @IsNotEmpty()
  @IsMongoId()
  employee: string;

  @ApiProperty({ example: 5000, description: 'Revenue Amount' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: false,
    example: '2025-12-01T13:15:32.000Z',
    description: 'Date of revenue record'
  })
  @IsOptional()
  date?: Date;
}

export class UpdateEmpRevenueDto extends PartialType(CreateEmpRevenueDto) {}
