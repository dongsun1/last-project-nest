import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5000)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  client: Record<string, any>;
  constructor() {
    this.client = {};
  }
  @WebSocketServer()
  server: Server;

  public handleConnection(client: Socket): void {
    console.log('hi');
    client['id'] = String(Number(new Date()));
    client['nickname'] = '낯선남자' + String(Number(new Date()));
    this.client[client['id']] = client;
  }

  public handleDisconnect(client: Socket): void {
    console.log('bye', client['id']);
    delete this.client[client['id']];
  }

  @SubscribeMessage('sendMessage')
  sendMessage(client: Socket, message: string): void {
    server.emit('getMessage', message);
  }
}
