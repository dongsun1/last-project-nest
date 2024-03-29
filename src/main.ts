import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SocketIoAdapter } from './adapters/socket-io.adapters';

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(__dirname + '/private.key', 'utf-8'),
    cert: fs.readFileSync(__dirname + '/certificate.crt', 'utf-8'),
    ca: fs.readFileSync(__dirname + '/ca_bundle.crt', 'utf-8'),
  };
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.enableCors();
  await app.init();

  const httpServer = http.createServer(server);
  const httpsServer = https.createServer(httpsOptions, server);

  app.useWebSocketAdapter(new SocketIoAdapter(httpServer));

  httpServer.listen(3000, () => {
    console.log('3000번 포트로 서버가 켜졌어요.');
  });
  httpsServer.listen(3001, () => {
    console.log('3001번 포트로 서버가 켜졌어요.');
  });
}

bootstrap();
