import { Controller, Get, Post, Body, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200) // Default, somente explicitando
  findAll() {
    return this.usersService.findAll();
  }

  @Post('signup')
  @HttpCode(201) // Default, somente explicitando
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('signin')
  @HttpCode(201) // Default, somente explicitando
  update(@Body() SigninUserDto: SigninUserDto) {
    return this.usersService.signin(SigninUserDto);
  }
}
