import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './../schemas/user/user.schema';
import { Model } from 'mongoose';
import { Injectable, Query } from '@nestjs/common';
import * as rp from 'request-promise';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SocialService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  naverLogin() {
    return;
  }

  naverLoginMain() {
    return;
  }

  kakaoLogin() {
    const kakao = {
        clientid: `${process.env.CLIENTID}`, //REST API
        redirectUri: 'https://d191gfhy5yq8br.cloudfront.net/main',
    };
    // console.log('kakao Clien_ID :', kakao.clientid) //undefined
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao.clientid}&redirect_uri=${kakao.redirectUri}`
    return {url: kakaoAuthURL }
  }

  async kakaoLoginMain(@Query() paginationQuery) {
    const kakao = {
        clientid: `${process.env.CLIENTID}`, //REST API
        redirectUri: 'https://d191gfhy5yq8br.cloudfront.net/main',
    };

    const { code } = paginationQuery;
    console.log('service code-->' , code); //undefined
    const options = {
      url: "https://kauth.kakao.com/oauth/token",
      method: "POST",
      form: {
        grant_type: "authorization_code",
        client_id: kakao.clientid,
        redirect_uri: kakao.redirectUri,
        code: code,
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      json: true,
    };
    const kakaotoken = await rp(options);
       console.log('token', kakaotoken)
    const options1 = {
      url: "https://kapi.kakao.com/v2/user/me",
      method: "GET",
      headers: {
        Authorization: `Bearer ${kakaotoken.access_token}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      json: true,
    };
    const userInfo = await rp(options1);
    // console.log('userInfo->', userInfo);
    const userId = userInfo.id;
    const userNick = userInfo.kakao_account.profile.nickname;
    console.log('userId-->',userId);
    console.log('userNick-->',userNick);
    const existUser = await this.userModel.findOne({ userId });
    console.log("existUser-->", existUser);
  
    if (!existUser) {
        const from = "kakao";
        const userWin = 0;
        const userLose = 0;
        const user = new this.userModel({ userId, userNick, from, userWin, userLose });
        console.log("user-->", user);
        await this.userModel.create(user);
    };
  
    const loginUser = await this.userModel.findOne({ userId });
    console.log("loginUser-->", loginUser);
    const token = jwt.sign({ userId: loginUser.userId }, `${process.env.KEY}`);
    // console.log("jwtToken-->", token);
    // console.log("User-->", token, userId, userNick);
    return{
        token,
        userId,
        userNick,
        msg:'카카오 로그인 완료.'
    };
  };
};
