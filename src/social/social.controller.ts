import { SocialService } from './social.service';
import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';

@Controller('')
export class SocialController {
  constructor(private readonly SocialService: SocialService) {}

  @Redirect('https://docs.nestjs.com', 302)
  @Get('naverLogin')
  naverLogin() {
    console.log('naverLogin Controller');
    return this.SocialService.naverLogin();
  };

  @Get('naverLogin/main')
  naverLoginMain(@Query() query:string) {
    return this.SocialService.naverLoginMain(query);
  };

  @Redirect('https://docs.nestjs.com', 302)
  @Get('kakaoLogin')
  kakaoLogin(@Res() res:any) {
    // console.log('kakaoLogin Controller');
    return this.SocialService.kakaoLogin();
  };

  @Get('main')
  kakaoLoginMain(@Query() query:string) {
    // const { code } = paginationQuery;

    // console.log('controller code :', code);
    return this.SocialService.kakaoLoginMain(query);
  };
}