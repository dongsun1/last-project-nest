import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Prop()
  roomId: number;

  @Prop()
  userId: string;

  @Prop()
  roomTitle: string;

  @Prop()
  roomPeople: string;

  @Prop()
  password: string;

  @Prop()
  currentPeople: string[];

  @Prop()
  currentPeopleSocketId: string[];

  @Prop()
  currentReadyPeople: string[];

  @Prop()
  start: boolean;

  @Prop()
  night: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
