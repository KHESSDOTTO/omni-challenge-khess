import { ConflictException, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    console.log('JWT Config:', {
      secret: configService.get('JWT_SECRET'),
      expiresIn: configService.get('JWT_EXPIRES_IN')
    });
  }

  async create(createUserDto: CreateUserDto): Promise<object> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const userToSave = this.userRepository.create({ ...createUserDto, password: hashedPassword });
      const savedUser = await userToSave.save();

      return { id: savedUser.id };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Username already exists');
      }
      
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  
  async findAll() {
    return await this.userRepository.find({
      select: {
        id: true,
        username: true,
        birthdate: true,
        balance: true,
      }
    });
  }

  async signin(SigninUserDto: SigninUserDto) {
    try {
      const { username, password } = SigninUserDto;
      const user = await this.userExists(username);
  
      const isPasswordValid = await this.authService.validatePassword(password, user.password);
  
      if (! isPasswordValid) {
        throw new UnauthorizedException('User validation failed');
      }
  
      const jwtInfo = { 
        userId: user.id,
        username: user.username,
        birthdate: user.birthdate,
      };
  
      try {
        const token = await this.jwtService.signAsync(jwtInfo);
        
        return {
          token,
          expiresIn: process.env.JWT_EXPIRES_IN
        };
      } catch (jwtError) {
        console.error('JWT Signing specific error:', jwtError);
        throw new InternalServerErrorException(`Token generation failed: ${jwtError.message}`);
      }
  
    } catch (error) {
      console.error('Signin error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }
  // --- Funções auxiliares ---

  private async userExists(username: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: { username }
      });
  
      if (! user) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      return user;
    } catch (error) {

      throw error;
    }
  }
}
