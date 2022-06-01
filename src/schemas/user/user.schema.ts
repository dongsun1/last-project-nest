import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  userId: string;

  @Prop()
  email: string;

  @Prop()
  userPw: string;

  @Prop()
  userNick: string;

  @Prop({ default : '0'})
  userProfile: string;

  @Prop({ default : 0 })
  userWin: number;

  @Prop({ default : 0 })
  userLose: number;

  @Prop()
  from: string;

  @Prop({ default : [] })
  friendList: [];

  @Prop({ default: false })
  login: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
