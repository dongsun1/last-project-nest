import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Prop({ required: true, unique: true })
  roomId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  roomTitle: string;

  @Prop({ required: true })
  roomPeople: number;

  @Prop()
  password: string;

  @Prop()
  currentPeople: string[];

  @Prop()
  currentPeopleSocketId: string[];

  @Prop()
  currentReadyPeople: string[];

  @Prop({ default: false })
  start: boolean;

  @Prop({ default: false })
  night: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
