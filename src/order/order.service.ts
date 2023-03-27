import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const order_unique_id = await this.generateID();
    const res = await new this.orderModel({
      ...createOrderDto,
      order_unique_id,
    }).save();
    return res;
  }
  async generateID() {
    let lastID =
      String(+(await this.findAll()).at(-1)?.order_unique_id + 1) || '0000000';
    return lastID.padStart(7, '0');
  }

  async findAll() {
    return this.orderModel.find().populate('currency_type_id').exec();
  }

  async findOneById(id: string) {
    return this.orderModel.findById(id).exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
