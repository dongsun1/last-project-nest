import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema()
export class Job {
  @Prop()
  roomId: number;

  @Prop()
  userSocketId: string;

  @Prop()
  userId: string;

  @Prop()
  userJob: string;

  @Prop()
  save: boolean;

  @Prop()
  AI: boolean;

  @Prop()
  chance: boolean;
}

export const JobSchema = SchemaFactory.createForClass(Job);
