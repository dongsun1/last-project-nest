import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import *as express from 'express';

async function bootstrap() {
  const httpsOptions = {
    key : fs.readFileSync(__dirname + "/private.key", "utf-8"),
    cert : fs.readFileSync(__dirname + "/certificate.crt", "utf-8"),
    ca : fs.readFileSync(__dirname + "/ca_bundle.crt", "utf-8")
  };
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  app.enableCors();
  await app.init();
  
  http.createServer(server).listen(3000, ()=> {
    console.log('3000번 포트로 서버가 켜졌어요.')
  });
  https.createServer(httpsOptions, server).listen(3001, () => {
    console.log('3001번 포트로 서버가 켜졌어요.')
  });
};

bootstrap();
