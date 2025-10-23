import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [GameModule, ChatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
