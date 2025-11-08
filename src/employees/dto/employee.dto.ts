import {
  IsOptional,
  IsString,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

class RelativeInfoDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  typeOfRelation: string;
}

class PermitInfoDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  permitImage?: string;
}

export class CreateEmployeeDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  birthdate?: string;

  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsString()
  type: 'fixed' | 'variable';

  @IsOptional()
  @Min(0)
  fixedSalary?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RelativeInfoDto)
  relativesInfo?: RelativeInfoDto[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PermitInfoDto)
  permitInfo?: PermitInfoDto;

  @IsOptional()
  @IsString()
  nationalIdImage?: string;

  @IsOptional()
  @IsString()
  militaryServiceCertificateImage?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;
}

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
