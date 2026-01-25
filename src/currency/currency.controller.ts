import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CurrencyService } from './currency.service';
import { Currency } from './shcema/currency.schema';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';


@ApiTags('Currencies')
@Controller('currencies')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post()
  @ApiOperation({ summary: 'Create new currency' })
  @ApiResponse({ status: 201, type: Currency })
  create(@Body() dto: CreateCurrencyDto) {
    return this.currencyService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all currencies' })
  @ApiResponse({ status: 200, type: [Currency] })
  findAll() {
    return this.currencyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get currency by id' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Currency })
  findOne(@Param('id') id: string) {
    return this.currencyService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update currency' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Currency })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCurrencyDto,
  ) {
    return this.currencyService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete currency' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.currencyService.delete(id);
  }
}
