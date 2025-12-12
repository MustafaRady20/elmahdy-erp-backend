import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class CreateRuleDto {
  @ApiProperty({ description: 'Title of the rule/instruction' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description/details of the rule/instruction' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Type: rule or instruction', required: false, enum: ['rule', 'instruction'], default: 'rule' })
  @IsOptional()
  @IsIn(['rule', 'instruction'])
  type?: 'rule' | 'instruction';

}

import { PartialType } from '@nestjs/swagger';

export class UpdateRuleDto extends PartialType(CreateRuleDto) {}

