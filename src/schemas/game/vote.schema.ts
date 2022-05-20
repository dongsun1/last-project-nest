import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VoteDocument = Vote & Document;

@Schema()
export class Vote {
  @Prop({ required: true })
  roomId: number;

  @Prop({ required: true })
  userSocketId: string;

  @Prop({ required: true })
  clickerJob: string;

  @Prop({ required: true })
  clickerId: string;

  @Prop({ required: true })
  clickedId: string;

  @Prop({ required: true })
  day: boolean;
}

export const VoteSchema = SchemaFactory.createForClass(Vote);
