import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
// export class HttpsRedirectMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: () => void){
//     const httpsPort = 3001
//     if(req.secure){
//       next();
//     }else{
//       const httpsUrl = `https://${req.hostname}:${httpsPort}${req.url}`;
//       // res.redirect(HttpStatus.PERMANENT_REDIRECT, httpsUrl)
//       res.redirect(httpsUrl)

//     }
//   }
// }
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
