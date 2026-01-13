import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { VipRevenuesService } from './vip-revenues.service';
import { CreateVipRevenueDto } from './dto/create-vip-revenue.dto';
import { UpdateVipRevenueDto } from './dto/update-vip-revenue.dto';
import { VipRevenue } from './schema/vip-revenues.schema';
import { VipRevenueFilterDto } from './dto/vip-revenue-filter.dto';

@ApiTags('VIP Revenues')
@Controller('vip-revenues')
export class VipRevenuesController {
  constructor(private readonly vipRevenuesService: VipRevenuesService) {}

  @Post()
  @ApiOperation({ summary: 'Create VIP revenue record' })
  @ApiCreatedResponse({ type: VipRevenue })
  create(@Body() dto: CreateVipRevenueDto) {
    return this.vipRevenuesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get VIP revenues with filters' })
  findAll(@Query() filter: VipRevenueFilterDto) {
    return this.vipRevenuesService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get VIP revenue by id' })
  @ApiParam({ name: 'id', example: '66c9f1f8a0b9c3d9f0e12345' })
  @ApiOkResponse({ type: VipRevenue })
  findOne(@Param('id') id: string) {
    return this.vipRevenuesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update VIP revenue' })
  @ApiOkResponse({ type: VipRevenue })
  update(@Param('id') id: string, @Body() dto: UpdateVipRevenueDto) {
    return this.vipRevenuesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete VIP revenue' })
  @ApiOkResponse({ description: 'VIP revenue deleted successfully' })
  remove(@Param('id') id: string) {
    return this.vipRevenuesService.remove(id);
  }
  @Get('statistics/:type')
  @ApiOperation({ summary: 'Get VIP revenue statistics' })
  @ApiParam({ name: 'type', enum: ['month', 'year', 'total'] })
  getStatistics(@Param('type') type: 'month' | 'year' | 'total') {
    return this.vipRevenuesService.getStatistics(type);
  }
}
