import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [GameModule],
  providers: [ChatGateway],
})
export class ChatModule {}
