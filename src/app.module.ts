import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SocialModule } from './social/social.module';
import { AppService } from './app.service';

@Module({
  imports: [
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
export class AppModule {}
