import { Controller, Get, Query, Redirect } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SocialService } from './social.service';

@Controller('')
export class SocialController {
  constructor(private readonly SocialService: SocialService) {}

  @Redirect('https://docs.nestjs.com', 302)
  @Get('naverLogin')
  naverLogin() {
    return this.SocialService.naverLogin();
  }

  @Get('naverLogin/main')
  naverLoginMain(@Query() query: string) {
    return this.SocialService.naverLoginMain(query);
  }

  @Redirect('https://docs.nestjs.com', 302)
  @Get('kakaoLogin')
  kakaoLogin() {
    return this.SocialService.kakaoLogin();
  }

  @Get('main')
  kakaoLoginMain(@Query() query: string) {
    return this.SocialService.kakaoLoginMain(query);
  }
}
