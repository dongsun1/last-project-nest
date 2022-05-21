import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { SocialModule } from './social/social.module';

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
  providers: [],
})
export class AppModule {}
