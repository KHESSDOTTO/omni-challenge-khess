import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(private jwtService: JwtService) {}

  async create(createUserDto: CreateUserDto): Promise<number> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
      const userToSave = User.create({
        ...createUserDto,
        password: hashedPassword,
      });
  
      const savedUser = await userToSave.save();
      return savedUser.id;
      
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') { // MySQL error code for duplicate entry
        throw new ConflictException('Username already exists');
      }
      
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  
  async findAll() {
    return await User.find();
  }

  async signin(SigninUserDto: SigninUserDto) {
    try {
      const user = await User.findOne({
        where: { username: SigninUserDto.username }
      });

      if (! user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(
        SigninUserDto.password,
        user.password
      );

      if (! isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const jwtInfo = { 
        userId: user.id,
        username: user.username,
      };

      return {
        token: await this.jwtService.signAsync(jwtInfo),
        expiresIn: process.env.JWT_EXPIRES_IN
      };

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Login failed');
    }
  }
}
