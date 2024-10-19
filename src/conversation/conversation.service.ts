import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class ConversationService {
  private redisClient: Redis.Redis;

  private TIME_TO_LIVE = process.env.TIME_TO_LIVE;

  constructor() {
    this.redisClient = new Redis.default();
  }

  async create(user1: string, user2: string) {
    const room = `conv:${user1}:${user2}`;
    const exists = await this.redisClient.exists(room);
    if (!exists) {
      await this.redisClient.rpush(
        room,
        JSON.stringify({ system: true, message: 'Conversation started' })
      );
      await this.redisClient.expire(room, this.TIME_TO_LIVE);
    }
    return { room, status: 'Conversation created or already exists' };
  }
}
