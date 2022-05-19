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
    const naver = {
      clientid: `${process.env.CLIENT_ID}`, //REST API
      redirectUri: 'http://localhost:3000/naverLogin/main',
      client_secret: `${process.env.CLIENT_SECRET}`,
      state: 'login'
    };

    const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver.clientid}&redirect_uri=${naver.redirectUri}&state=${naver.state}`;
    return {url: naverAuthURL}
  }

  async naverLoginMain(query) {
    const naver = {
      clientid: `${process.env.CLIENT_ID}`, //REST API
      redirectUri: 'http://localhost:3000/naverLogin/main',
      client_secret: `${process.env.CLIENT_SECRET}`,
      state: 'login'
    };

    const { code, state } = query;
    console.log('Naver service code-->' , code); //undefined
    console.log('Naver service state-->' , state); //undefined

    const naver_api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + naver.clientid + '&client_secret=' + naver.client_secret + '&redirect_uri=' + naver.redirectUri + '&code=' + code + '&state=' + state;

    var options = {
        url: naver_api_url,
        headers: {
            'X-Naver-Client-Id':naver.clientid,
            'X-Naver-Client-Secret': naver.client_secret
        }
     };
     const result = await rp.get(options);
     console.log('result->', result)
     const naverToken = JSON.parse(result).access_token;
     console.log('naverToken->', naverToken);

     const info_options = {
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: {'Authorization': 'Bearer ' + naverToken}
    };
    const info_result = await rp.get(info_options);
  	// string 형태로 값이 담기니 JSON 형식으로 parse를 해줘야 한다.
    const info_result_json = JSON.parse(info_result).response;
    // console.log('info->', info_result_json);
    const userId = info_result_json.id;
    const userNick = info_result_json.nickname;
    const email = info_result_json.email;
    // console.log('userId',userId)
    // console.log('nickname',nickname)
    // console.log('email',email)


    // 가입여부 중복확인
    const existUser = await this.userModel.findOne({ userId });
    console.log("existUser-->", existUser);
  
    if (!existUser) {
      const from = "naver";
      const userWin = 0;
      const userLose = 0;
      const user = new this.userModel({ userId, userNick, email, from });
      console.log("user-->", user);
      await this.userModel.create(user);
    }
  
    const loginUser = await this.userModel.findOne({ userId });
    // const naverId = loginUser[0].userId
    // const naverNick = loginUser[0].userNick
    const token = jwt.sign({ userId: loginUser.userId }, `${process.env.KEY}`);
    console.log("token-->", token);
    return{
      token,
      userId,
      userNick,
      msg:'네이버 로그인 완료.'
    };

  }

  kakaoLogin() {
    const kakao = {
        clientid: `${process.env.CLIENTID}`, //REST API
        redirectUri: 'http://localhost:3000/main',
        // redirectUri: 'https://d191gfhy5yq8br.cloudfront.net/main',

    };
    // console.log('kakao Clien_ID :', kakao.clientid) //undefined
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao.clientid}&redirect_uri=${kakao.redirectUri}`
    return {url: kakaoAuthURL }
  }

  async kakaoLoginMain(@Query() paginationQuery) {
    const kakao = {
        clientid: `${process.env.CLIENTID}`, //REST API
        redirectUri: 'http://localhost:3000/main',
        // redirectUri: 'https://d191gfhy5yq8br.cloudfront.net/main',
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
