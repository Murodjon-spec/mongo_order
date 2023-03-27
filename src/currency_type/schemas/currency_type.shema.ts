import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CurrencyTypeDocument = HydratedDocument<CurrencyType>;

@Schema()
export class CurrencyType {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const CurrencyTypeSchema = SchemaFactory.createForClass(CurrencyType);
