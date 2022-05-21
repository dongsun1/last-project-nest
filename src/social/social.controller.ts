import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { SocialService } from './social.service';

@Controller('')
export class SocialController {
  constructor(private readonly SocialService: SocialService) {}

  @Get('naverLogin')
  naverLogin() {
    return this.SocialService.naverLogin();
  }

  @Get('naverLogin/main')
  naverLoginMain(@Query() query: string) {
    return this.SocialService.naverLoginMain(query);
  }

  @Get('kakaoLogin')
  kakaoLogin(@Res() res: any) {
    // console.log('kakaoLogin Controller');
    return this.SocialService.kakaoLogin();
  }

  @Get('main')
  kakaoLoginMain(@Query() query: string) {
    // const { code } = paginationQuery;
    // console.log('controller code :', code);
    return this.SocialService.kakaoLoginMain(query);
  }
}
