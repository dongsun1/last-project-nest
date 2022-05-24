import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [],
      useFactory: async () => {
        mongo = await MongoMemoryServer.create();
        const uri = await mongo.getUri();
        return {
          uri: uri,
        };
      },
    }),
  ],
})
export class TestDocumentDatabaseModule {}

export const closeInMongodConnection = async () => {
  if (mongo) await mongo.stop();
};
