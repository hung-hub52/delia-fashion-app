import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsIn(['admin', 'user'])
  senderRole: 'admin' | 'user';

  @IsString()
  @IsNotEmpty()
  text: string;
}
