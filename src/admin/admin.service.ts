import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    const { user_name, password } = createAdminDto;
    const hashed_password = await bcrypt.hash(password, 7);
    const createdAdmin = new this.adminModel({
      user_name,
      hashed_password,
    });
    return createdAdmin.save();
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    return this.adminModel.findByIdAndUpdate(changePasswordDto);
  }

  async findAll() {
    return this.adminModel.find().exec();
  }

  async findOneById(id: string) {
    return this.adminModel.findById(id).exec();
  }

  async findOneByUserName(user_name: string) {
    const res = await this.adminModel.findOne({ user_name: user_name }).exec();
    return res;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const res = await this.adminModel
      .findByIdAndUpdate(id, updateAdminDto, { new: true })
      .exec();
    return res;
  }

  async remove(id: string) {
    return this.adminModel.findByIdAndDelete(id).exec();
  }
}
