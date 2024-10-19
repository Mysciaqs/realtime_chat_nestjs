import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationModule } from './conversation/conversation.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ConversationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
