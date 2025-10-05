import {
  Controller, Get, Post, Param, Query, Body, ParseIntPipe,
} from '@nestjs/common';
import { ChatSupportService } from './chat-support.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateThreadDto } from './dto/create-thread.dto';

@Controller('support')
export class ChatSupportController {
  constructor(private readonly svc: ChatSupportService) {}

  /* GET /api/support/threads */
  @Get('threads')
  listThreads() {
    return this.svc.listThreads();
  }

  /* POST /api/support/threads  body: { customerId, title? } */
  @Post('threads')
  createThread(@Body() dto: CreateThreadDto) {
    return this.svc.createThread(dto.customerId);
  }

  /* GET /api/support/threads/:id/messages?beforeTs&limit=50 */
  @Get('threads/:id/messages')
  getMessages(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit') limit?: string,
    @Query('beforeTs') beforeTs?: string,
  ) {
    const lim = Number(limit || 50);
    const bt = beforeTs ? Number(beforeTs) : undefined;
    return this.svc.getMessages(id, lim, bt);
  }

  /* POST /api/support/threads/:id/messages  body: { senderRole, text } */
  @Post('threads/:id/messages')
  sendMessage(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.svc.sendMessage(id, dto);
  }

  /* POST /api/support/threads/:id/read/admin */
  @Post('threads/:id/read/admin')
  markReadAdmin(@Param('id', ParseIntPipe) id: number) {
    return this.svc.markReadForAdmin(id);
  }

  /* POST /api/support/threads/:id/read/user */
  @Post('threads/:id/read/user')
  markReadUser(@Param('id', ParseIntPipe) id: number) {
    return this.svc.markReadForUser(id);
  }

  @Get('meta')
getSupportMeta() {
  return this.svc.getSupportMeta();
}

@Post('threads/:id/end')
end(@Param('id') id: string) {
  return this.svc.endSupport(Number(id));
}
}
