import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongo;

@Module({
  imports: [
    ConfigModule.forRoot(),
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
