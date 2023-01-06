import { ChangePwDto } from './dto/changePw.dto';
import { FindPwDto } from './dto/findPw.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { SignUpUserDto } from './../user/dto/signup-user.dto';
import { User, UserDocument } from '../schemas/user/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { ProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  // Register
  async register(signUpData: SignUpUserDto) {
    const { userId, email, userPw, userPwCheck, userNick } = signUpData;
    // Validation Check
    const userNickReg = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,15}$/; //2~15자 한글,영문,숫자
    const emailReg =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    const userPwReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,15}$/; //4~15자 영문+숫자

    // signup -> userId, userName 중복검사
    const existUsers = await this.userModel.findOne({
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
    } else if (existUsers) {
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

  // Login
  async login(loginData: LoginUserDto) {
    const { userId, userPw } = loginData;
    const user = await this.userModel.findOne({ userId });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '아이디 또는 비밀번호가 틀렸습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const unHashPw = bcrypt.compareSync(userPw, user.userPw);
      if (unHashPw === false) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            errorMessage: '아이디 또는 비밀번호가 틀렸습니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const token = jwt.sign({ userId: user.userId }, `${process.env.KEY}`);
    await this.userModel.updateOne({ userId }, { $set: { login: true } });

    return {
      token,
      userId: user.userId,
      userNick: user.userNick,
    };
  }

  // FindUser
  async findUser(userId: string) {
    return await this.userModel.findOne({ userId });
  }

  // Logout
  async logout(userId: string) {
    const result = await this.userModel.updateOne(
      { userId },
      { $set: { login: false } },
    );
    if (result.modifiedCount === 1) {
      return { msg: '로그아웃 성공' };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '로그아웃 실패',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // LoginCheck
  loginCheck(user: User) {
    return {
      userId: user.userId,
      userNick: user.userNick,
    };
  }

  // GameRecord
  async gameRecord(userId: string) {
    const userRecord = await this.userModel.findOne({
      userId: userId,
    });
    if (userRecord) {
      return {
        msg: '게임 전적 조회 성공',
        userWin: userRecord.userWin,
        userLose: userRecord.userLose,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '게임 전적 조회 실패',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Friend Add
  async friendAdd(friendUser: string, user: User) {
    const loginUser = user.userId;

    const searchInfo = await this.userModel.findOne({ userId: friendUser });

    if (searchInfo == null || searchInfo == undefined) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '존재하지 않는 아이디입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const existFriend = await this.userModel.find(
        { userId: loginUser },
        { friendList: { $elemMatch: { userId: friendUser } } },
      );

      if (existFriend[0].friendList.length !== 0) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            errorMessage: '이미 추가된 친구입니다.',
          },
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.userModel.updateOne(
          { userId: loginUser },
          { $push: { friendList: { userId: friendUser } } },
        );
      }
    }
    return '친구추가 완료';
  }

  // Friend Remove
  async friendRemove(removeUser: string, user: User) {
    const loginUser = user.userId;
    await this.userModel.updateOne(
      { userId: loginUser },
      { $pull: { friendList: { userId: removeUser } } },
    );
    return '삭제완료';
  }

  // Friend List
  async friendList(user: User) {
    const userId = user.userId;
    const userInfo = await this.userModel.findOne({ userId });
    const friendList = userInfo.friendList;

    return friendList;
  }

  // Password Find & Nodemailer
  async findPw(findPw: FindPwDto) {
    const { email, userId } = findPw;
    const userInfo = await this.userModel.findOne({ userId, email });

    const emailReg =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (userId == '' || userId == undefined || userId == null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '아이디를 입력하세요.',
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
    } else if (!userInfo) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '등록되지 않은 이메일 또는 아이디 입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const variable =
      '0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(
        ',',
      );
    const randomPassword = createRandomPassword(variable, 8);
    function createRandomPassword(variable: string[], passwordLength: number) {
      let randomString = '';
      for (let i = 0; i < passwordLength; i++)
        randomString += variable[Math.floor(Math.random() * variable.length)];
      return randomString;
    }

    const transporter = nodemailer.createTransport({
      service: 'naver',
      host: 'smtp.naver.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '7707jo',
        pass: `${process.env.PASSWORD}`,
      },
    });

    const emailOptions = {
      // 옵션값 설정
      from: '7707jo@naver.com',
      to: email,
      subject: '마피양에서 임시비밀번호를 알려드립니다.',
      html:
        '<h1 >마피양에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : ' +
        randomPassword +
        '</h2>' +
        '<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>',
    };
    transporter.sendMail(emailOptions, (err, info) => {
      transporter.close();
    });
    const hashedPw = await bcrypt.hash(randomPassword, 10);
    await this.userModel.findOneAndUpdate(
      { userId: userId },
      { $set: { userPw: hashedPw } },
      { new: true },
    );
    return '임시 비밀번호가 생성되었습니다.';
  }

  // Password Change
  async changePw(changePw: ChangePwDto) {
    const { userId, password, newPw, newPwCheck } = changePw;
    const userInfo = await this.userModel.findOne({ userId });

    let unHashPw;

    if (userInfo) {
      unHashPw = bcrypt.compareSync(password, userInfo.userPw);
    } else {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '존재하지 않는 아이디입니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (unHashPw == false) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '임시 비밀번호가 틀렸습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else if (newPw !== newPwCheck) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '새 비밀번호와 새 비밀번호 확인란이 일치하지 않습니다.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedPw = await bcrypt.hash(newPw, 10);
    await this.userModel.findOneAndUpdate(
      { userId: userId },
      { $set: { userPw: hashedPw } },
      { new: true },
    );
    return '비밀번호 변경 완료';
  }

  // Profile 조회
  async getProfile(user: User) {
    try {
      const userId = user.userId;
      const userProfile = await this.userModel.findOne({ userId });
      const result = true;
      return { result, profile: userProfile.userProfile };
    } catch (e) {
      const result = false;
      const msg = '실패';
      return { result, msg };
    }
  }

  // Profle Modify
  async postProfile(user: User, Profile: ProfileDto) {
    try {
      const userId = user.userId;
      const { userProfile } = Profile;
      await this.userModel.findOneAndUpdate(
        { userId: userId },
        { $set: { userProfile: Number(userProfile) } },
        { new: true },
      );
      const result = true;
      const msg = '등록 성공';
      return { result, msg };
    } catch (error) {
      const result = false;
      const msg = '등록 실패';
      return { result, msg };
    }
  }
}
