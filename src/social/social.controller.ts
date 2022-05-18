import { SocialService } from './social.service';
import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';

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

  @Redirect('https://docs.nestjs.com', 302)
  @Get('kakaoLogin')
    kakaoLogin(@Res() res:any) {
        console.log('kakaoLogin Controller');
        return this.SocialService.kakaoLogin();
    }

  @Get('main')
  kakaoLoginMain(@Query() paginationQuery) {
    // const { code } = paginationQuery;
    // console.log('controller code :', code);
    return this.SocialService.kakaoLoginMain(paginationQuery);
  }
}