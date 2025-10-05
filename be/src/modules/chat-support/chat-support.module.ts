import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessage } from './entities/chat-message.entity';
import { ChatSupportController } from './chat-support.controller';
import { ChatSupportService } from './chat-support.service';

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessage])],
  controllers: [ChatSupportController],
  providers: [ChatSupportService],
  exports: [ChatSupportService],
})
export class ChatSupportModule {}
