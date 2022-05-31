import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user/user.schema';
import { EventsGateway } from './events.gateway';
import { RoomSchema } from 'src/schemas/game/room.schema';
import { JobSchema } from 'src/schemas/game/job.schema';
import { VoteSchema} from './../schemas/game/vote.schema';


@Module({
    imports: 
    [
      MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]),
      MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
      MongooseModule.forFeature([{ name: 'Vote', schema: VoteSchema }]),
    ],
  providers: [EventsGateway],
})
export class EventsModule {}