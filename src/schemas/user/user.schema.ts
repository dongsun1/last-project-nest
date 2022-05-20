import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  userPw: string;

  @Prop({ required: true })
  userNick: string;

  @Prop({ default: 0 })
  userProfile: string;

  @Prop({ default: 0 })
  userWin: number;

  @Prop({ default: 0 })
  userLose: number;

  @Prop()
  from: string;

  @Prop([String])
  friendList: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
