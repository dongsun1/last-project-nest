import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  @Prop({ required: true, unique: true })
  roomId: number;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  roomTitle: string;

  @Prop({ required: true })
  roomPeople: string;

  @Prop()
  password: string;

  @Prop([String])
  currentPeople: string[];

  @Prop([String])
  currentPeopleSocketId: string[];

  @Prop([String])
  currentReadyPeople: string[];

  @Prop({ default: false })
  start: boolean;

  @Prop({ default: false })
  night: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
