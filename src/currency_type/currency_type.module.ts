import { Module } from '@nestjs/common';
import { CurrencyTypeService } from './currency_type.service';
import { CurrencyTypeController } from './currency_type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CurrencyType,
  CurrencyTypeSchema,
} from './schemas/currency_type.shema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CurrencyType.name, schema: CurrencyTypeSchema },
    ]),JwtModule
  ],
  controllers: [CurrencyTypeController],
  providers: [CurrencyTypeService],
})
export class CurrencyTypeModule {}
