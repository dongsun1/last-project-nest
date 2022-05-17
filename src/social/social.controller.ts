import { SocialService } from './social.service';
import { Controller, Get } from '@nestjs/common';

@Controller('')
export class SocialController {
  constructor(private readonly SocialService: SocialService) {}

  @Get('naverLogin')
  naverLogin() {
    return this.SocialService.naverLogin();
  }

  @Get('naverLogin/main')
  naverLoginMain() {
    return this.SocialService.naverLoginMain();
  }

  @Get('kakaoLogin')
  kakaoLogin() {
    return this.SocialService.kakaoLogin();
  }

  @Get('main')
  kakaoLoginMain() {
    return this.SocialService.kakaoLoginMain();
  }
}
