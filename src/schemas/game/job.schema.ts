import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema()
export class Job {
  @Prop({ required: true })
  roomId: number;

  @Prop({ required: true })
  userSocketId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  userJob: string;

  @Prop({ default: true })
  save: boolean;

  @Prop({ default: false })
  AI: boolean;

  @Prop({ default: false })
  chance: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);
