import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as Redis from 'ioredis';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ConversationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private redisClient: Redis.Redis;
  private logger: Logger = new Logger('ConversationGateway');

  private REDIS_HOST = process.env.REDIS_HOST;
  private REDIS_PORT = process.env.REDIS_PORT;
  private MESSAGE_HISTORY_AMOUNT = process.env.MESSAGE_HISTORY_AMOUNT;

  constructor() {
    this.redisClient = new Redis.default(this.REDIS_PORT, this.REDIS_HOST);
  }

  async afterInit(_server: Server) {
    return this.logger.log(`Initialized websocket server`);
  }

  async handleConnection(client: Socket) {
    return this.logger.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    return this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, payload: { room: string }) {
    const { room } = payload;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
    const messageHistory = await this.redisClient.lrange(
      room,
      0,
      this.MESSAGE_HISTORY_AMOUNT
    );
    client.emit('messageHistory', messageHistory);
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, payload: { room: string }) {
    const { room } = payload;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    client: Socket,
    payload: { room: string; userId: string; content: string }
  ) {
    const { room, userId, content } = payload;
    const message = {
      clientId: client.id,
      userId: userId,
      message: content,
      timestamp: new Date(),
    };
    this.server.to(room).emit('newMessage', message);
    await this.redisClient.rpush(room, JSON.stringify(message));
  }
}
