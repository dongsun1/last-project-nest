import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import *as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const httpsOptions = {
    key : fs.readFileSync("./private.key", "utf-8"),
    cert : fs.readFileSync("./certificate.crt", "utf-8"),
    ca : fs.readFileSync("./ca_bundle.crt", "utf-8")
  };
  const server = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  );
  await app.init();
  
  http.createServer(server).listen(80);
  https.createServer(httpsOptions, server).listen(443);
};

bootstrap();
