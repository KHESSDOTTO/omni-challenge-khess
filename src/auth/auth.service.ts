// auth/auth.service.ts
import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: User) {
    const jwtInfo = { 
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: await this.jwtService.signAsync(jwtInfo),
      expires_in: process.env.JWT_EXPIRES_IN
    };
  }

  async validatePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}