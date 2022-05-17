import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema()
export class Vote {
  @Prop()
  roomId: number;

  @Prop()
  userSocketId: string;

  @Prop()
  clickerJob: string;

  @Prop()
  clickerId: string;

  @Prop()
  clickedId: string;

  @Prop()
  day: boolean;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
