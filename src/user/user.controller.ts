import { LoginUserDto } from './dto/login-user.dto';
import { SignUpUserDto } from './../user/dto/signup-user.dto';
import { User } from '../schemas/user/user.schema';
import { UserService } from './user.service';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() signUpData: SignUpUserDto) {
    return await this.userService.register(signUpData);
  }

  @Post('login')
  async login(@Body() loginData: LoginUserDto) {
    return await this.userService.login(loginData);
  }
}
