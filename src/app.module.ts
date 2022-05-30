import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService, HttpsRedirectMiddleware } from './app.service';
import { SocialModule } from './social/social.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB}majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UserModule,
    SocialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer)
{
    consumer.apply(HttpsRedirectMiddleware).forRoutes("*");
}
}