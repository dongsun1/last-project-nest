import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './../schemas/user/user.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

const naver = {
  clientid: `${process.env.CLIENT_ID}`, //REST API
  redirectUri: 'http://localhost:3000/naverLogin/main',
  client_secret: `${process.env.CLIENT_SECRET}`,
  state: 'login',
};

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
    return;
  }

  kakaoLoginMain() {
    return;
  }
}
