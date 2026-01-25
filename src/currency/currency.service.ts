import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency, CurrencyDocument } from './shcema/currency.schema';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';


@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<CurrencyDocument>,
  ) {}

  async create(dto: CreateCurrencyDto): Promise<Currency> {
    return this.currencyModel.create(dto);
  }

  async findAll(): Promise<Currency[]> {
    return this.currencyModel.find().lean();
  }

  async findById(id: string): Promise<Currency> {
    const currency = await this.currencyModel.findById(id);
    if (!currency) {
      throw new NotFoundException('Currency not found');
    }
    return currency;
  }

  async update(
    id: string,
    dto: UpdateCurrencyDto,
  ): Promise<Currency> {
    const currency = await this.currencyModel.findByIdAndUpdate(
      id,
      dto,
      { new: true },
    );

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return currency;
  }

  async delete(id: string): Promise<void> {
    const res = await this.currencyModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('Currency not found');
    }
  }
}
