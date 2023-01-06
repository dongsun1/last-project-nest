import { ChangePwDto } from './dto/changePw.dto';
import { FindPwDto } from './dto/findPw.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpUserDto } from './../user/dto/signup-user.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { FriendUserDto } from './dto/friendAdd.dto';
import { RemoveUserDto } from './dto/friendRemove.dto';
import { ProfileDto } from './dto/profile.dto';

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

  @Get('logout')
  async logout(@Res() res: any) {
    const { userId } = res.locals.user;
    const result = await this.userService.logout(userId);
    res.status(HttpStatus.OK).send(result);
  }

  @Get('loginCheck')
  loginCheck(@Res() res: any) {
    const user = this.userService.loginCheck(res.locals.user);
    res.status(HttpStatus.OK).send(user);
  }

  @Get('gameRecord')
  gameRecord(@Res() res: any) {
    const gameRecord = this.userService.gameRecord(res.locals.user.userId);
    res.status(HttpStatus.OK).send(gameRecord);
  }

  @Post('friendAdd')
  async friendAdd(@Body() friendUser: FriendUserDto, @Res() res: any) {
    const msg = await this.userService.friendAdd(
      friendUser.friendUser,
      res.locals.user,
    );
    res.status(HttpStatus.OK).send(msg);
  }

  @Post('friendRemove')
  async friendRemove(@Body() removeUser: RemoveUserDto, @Res() res: any) {
    const msg = await this.userService.friendRemove(
      removeUser.removeUser,
      res.locals.user,
    );
    res.status(HttpStatus.OK).send(msg);
  }

  @Post('friendList')
  async friendList(@Res() res: any) {
    const friendList = await this.userService.friendList(res.locals.user);
    res.status(HttpStatus.OK).send(friendList);
  }

  @Post('findPw')
  async findPw(@Body() findPw: FindPwDto) {
    return await this.userService.findPw(findPw);
  }

  @Post('changePw')
  async changePw(@Body() changePw: ChangePwDto) {
    return await this.userService.changePw(changePw);
  }

  @Get('profile')
  async getProfile(@Res() res: any) {
    const userData = await this.userService.getProfile(res.locals.user);
    res.status(HttpStatus.OK).send(userData);
  }

  @Post('profile')
  async postProfile(@Body() userProfile: ProfileDto, @Res() res: any) {
    const userData = await this.userService.postProfile(
      res.locals.user,
      userProfile,
    );
    res.status(HttpStatus.OK).send(userData);
  }
}
