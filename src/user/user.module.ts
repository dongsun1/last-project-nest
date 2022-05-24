import { AuthMiddleware } from './../middleware/authMiddleware';
import { User, UserSchema } from '../schemas/user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'user/register', method: RequestMethod.POST },
        { path: 'user/login', method: RequestMethod.POST },
        // { path: 'user/findPw', method: RequestMethod.POST },
        // { path: 'user/changePw', method: RequestMethod.POST },
        // { path: 'user/friendAdd', method: RequestMethod.POST },
        // { path: 'user/friendRemove', method: RequestMethod.POST },
        // { path: 'user/friendList', method: RequestMethod.POST },
      )
      .forRoutes(UserController);
  }
}
