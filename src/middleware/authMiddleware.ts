import { NextFunction, Request, Response } from 'express';
import { UserService } from './../user/user.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = authorization.split(' ');

    if (tokenType !== 'Bearer') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '로그인 후 이용하세요!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const token = jwt.verify(tokenValue, `${process.env.KEY}`) as JwtPayload;
      this.userService.findUser(token.userId).then((user) => {
        res.locals.user = user;
        next();
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '로그인 후 이용하세요!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
