import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Operation, OperationDocument } from './schemas/operation.schema';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';

@Injectable()
export class OperationService {
  constructor(
    @InjectModel(Operation.name)
    private operationModel: Model<OperationDocument>,
  ) {}

  async create(createOperationDto: CreateOperationDto) {
    const res = new this.operationModel(createOperationDto);
    return res.save();
  }

  async findAll() {
    return this.operationModel.find().exec();
  }

  async findOneById(id: string) {
    return this.operationModel.findById(id).exec();
  }

  async update(id: string, updateOperationDto: UpdateOperationDto) {
    return this.operationModel
      .findByIdAndUpdate(id, updateOperationDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.operationModel.findByIdAndDelete(id).exec();
  }
}
