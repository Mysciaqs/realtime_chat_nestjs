import { Body, Controller, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Post('create')
  async createConversation(@Body() body: { user1: string; user2: string }) {
    const { user1, user2 } = body;
    return await this.conversationService.create(user1, user2);
  }
}
