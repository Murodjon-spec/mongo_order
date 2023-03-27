import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CurrencyType,
  CurrencyTypeDocument,
} from './schemas/currency_type.shema';
import { CreateCurrencyTypeDto } from './dto/create-currency_type.dto';
import { UpdateCurrencyTypeDto } from './dto/update-currency_type.dto';

@Injectable()
export class CurrencyTypeService {
  constructor(
    @InjectModel(CurrencyType.name)
    private currencyTypeModel: Model<CurrencyTypeDocument>,
  ) {}

  async create(createCurrencyTypeDto: CreateCurrencyTypeDto) {
    const res = new this.currencyTypeModel(createCurrencyTypeDto);
    return res.save();
  }

  async findAll() {
    return this.currencyTypeModel.find().exec();
  }

  async findOneById(id: string) {
    return this.currencyTypeModel.findById(id).exec();
  }

  async update(id: string, updateCurrencyTypeDto: UpdateCurrencyTypeDto) {
    return this.currencyTypeModel
      .findByIdAndUpdate(id, updateCurrencyTypeDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.currencyTypeModel.findByIdAndDelete(id).exec();
  }
}
