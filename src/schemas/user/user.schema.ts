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

  @Prop()
  userProfile: string;

  @Prop()
  userWin: number;

  @Prop()
  userLose: number;

  @Prop()
  from: string;

  @Prop()
  friendList: [];
}

export const UserSchema = SchemaFactory.createForClass(User);
