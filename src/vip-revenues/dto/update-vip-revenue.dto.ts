import { PartialType } from '@nestjs/swagger';
import { CreateVipRevenueDto } from './create-vip-revenue.dto';

export class UpdateVipRevenueDto extends PartialType(CreateVipRevenueDto) {}
