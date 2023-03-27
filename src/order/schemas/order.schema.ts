import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CurrencyType } from '../../currency_type/schemas/currency_type.shema';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ required: true })
  order_unique_id: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  phone_number: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  product_link: string;

  @Prop()
  summa: number;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'CurrencyType' }])
  currency_type_id: CurrencyType[];

  @Prop()
  truck: string;

  @Prop()
  description: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
