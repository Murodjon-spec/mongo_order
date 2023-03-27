import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AdminService } from '../admin/admin.service';
import { CreateAdminDto } from '../admin/dto/create-admin.dto';
import { Admin } from '../admin/schemas/admin.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, res: Response) {
    const { username, password } = loginDto;
    const admin = await this.adminService.findOneByUserName(username);
    if (!admin) {
      throw new HttpException(
        `Bunday admin mavjud emas`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const isMatchPass = await bcrypt.compare(password, admin.hashed_password);
    if (!isMatchPass) {
      throw new UnauthorizedException(`Admin not registered`);
    }
    const tokens = await this.getToken(admin, admin.id);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updatedUser = await this.adminService.update(admin.id, {
      hashed_token: hashed_refresh_token,
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'ADMIN LOGIN',
      user: updatedUser,
      tokens,
    };
    return response;
  }

  async logout(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException('User not found');
    }
    const updatedUser = await this.adminService.update(userData.id, {
      hashed_token: refreshToken,
    });
    res.clearCookie('refresh_token');
    const response = {
      message: 'User logged out successfully',
      user: updatedUser,
    };
    return response;
  }

  private async getToken(admin: Admin, id: string) {
    const payload = {
      id,
      is_active: admin.is_active,
      is_owner: admin.is_creator,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return { access_token: accessToken, refresh_token: refreshToken };
  }

  // async refreshToken(user_id: number, refreshToken: string, res: Response) {
  //   const decodedToken = this.jwtService.decode(refreshToken);

  //   if (user_id != decodedToken['id']) {
  //     throw new BadRequestException('user not found');
  //   }
  //   const user = await this.adminService.getUserById(user_id);
  //   if (!user || !user.hashed_password) {
  //     throw new BadRequestException('user not found');
  //   }

  //   const tokenMatch = await bcrypt.compare(refreshToken, user.hashed_password);
  //   const tokens = await this.getToken(user);

  //   const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);

  //   const updatedUser = await this.adminService.updateUser(user.id, {
  //     hashed_refresh_token: hashed_refresh_token,
  //   });
  // }
}
