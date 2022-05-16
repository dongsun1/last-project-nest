import { LoginUserDto } from './dto/login-user.dto';
import { SignUpUserDto } from './../user/dto/signup-user.dto';
import { User, UserDocument } from '../schemas/user/user.schema';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(signUpData: SignUpUserDto) {
    const { userId, email, userPw, userPwCheck, userNick } = signUpData;
    // Validation Check
    const userNickReg = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,15}$/; //2~15자 한글,영문,숫자
    const emailReg =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const userPwReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,15}$/; //4~15자 영문+숫자

    // signup -> userId, userName 중복검사
    const existUsers = await this.userModel.find({
      $or: [{ userId }, { userNick }, { email }],
    });

    if (userId == '' || userId == undefined || userId == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '아이디를 입력하세요.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (!userPwReg.test(userId)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '아이디는 4~15자 영문 및 숫자만 가능합니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (email == '' || email == undefined || email == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '이메일을 입력하세요.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (!emailReg.test(email)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '이메일 형식을 올바르게 입력해주세요.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (userNick == '' || userNick == undefined || userNick == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '닉네임을 입력하세요.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (!userNickReg.test(userNick)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (existUsers.length) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '이미 가입된 아이디,닉네임 또는 이메일 입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (userPw == '' || userPw == undefined || userPw == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '비밀번호를 입력하세요.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (
      userPwCheck == '' ||
      userPwCheck == undefined ||
      userPwCheck == null
    ) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '비밀번호 확인란을 입력하세요.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (!userPwReg.test(userPw)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '4~15자, 영문 및 숫자만 가능합니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (userPw !== userPwCheck) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '비밀번호가 비밀번호 확인란과 일치하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // bcrypt module -> 암호화
    // 10 --> saltOrRound --> salt를 10번 실행 (높을수록 강력)
    const userWin = 0;
    const userLose = 0;
    const from = 'webSite';
    const hashed = await bcrypt.hash(userPw, 10);

    await this.userModel.create({
      userId,
      email,
      userNick,
      userWin,
      userLose,
      userPw: hashed,
      from,
    });

    return {
      msg: '회원가입 완료',
      userId,
      userNick,
    };
  }

  async login(loginData: LoginUserDto) {
    const { userId, userPw } = loginData;
    const user = await this.userModel.findOne({ userId });

    // body passowrd = unHashPassword -->true
    const unHashPw = await bcrypt.compareSync(userPw, user.userPw);
    console.log('unHashPw->', unHashPw); // true or false
    // userId, password 없는경우
    if (user.userId !== userId || unHashPw == false) {
      return {
        errorMessage: '아이디 또는 비밀번호가 틀렸습니다.',
      };
    }

    const token = jwt.sign({ userId: user.userId }, `${process.env.KEY}`);
    // console.log('webtoken-->',token)

    return { token, userId };
  }
}
