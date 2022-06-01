import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema()
export class Vote {
  @Prop({ required: true })
  roomId: string;

  @Prop()
  userSocketId: string;

  @Prop({ required: true })
  clickerJob: string;

  @Prop({ required: true })
  clickerNick: string;

  @Prop({ required: true })
  clickedNick: string;

  @Prop({ default: true })
  day: boolean;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
