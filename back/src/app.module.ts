import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { LivekitModule } from './livekit/livekit.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './auth';

@Module({
  imports: [
    GameModule,
    ChatModule,
    LivekitModule,
    ConfigModule.forRoot(),
    AuthModule.forRoot({ auth, disableGlobalAuthGuard: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
