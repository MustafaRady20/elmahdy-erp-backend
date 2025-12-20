import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CafeService, CreateCafeDto, UpdateCafeDto } from './cafe.service';

@Controller('cafes')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Post()
  create(@Body() createCafeDto: CreateCafeDto) {
    return this.cafeService.create(createCafeDto);
  }

  @Get()
  findAll(@Query('branch') branch?: string) {
    if (branch) {
      return this.cafeService.findByBranch(branch);
    }
    return this.cafeService.findAll();
  }

  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cafeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCafeDto: UpdateCafeDto) {
    return this.cafeService.update(id, updateCafeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cafeService.remove(id);
  }
}