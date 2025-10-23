import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatMessage } from '@trabalho-apsoo/shared';
import { Server, Socket } from 'socket.io';
import { GameService } from 'src/game/game.service';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('chat:sendMessage')
  handleChatMessage(client: Socket, payload: { message: string }): void {
    const chatMessagePayload: ChatMessage = {
      id: client.id,
      username: this.gameService.getUsernameBySocketId(client.id),
      message: payload.message,
      timestamp: new Date().toISOString(),
    };

    this.broadcastMessage(chatMessagePayload);
  }

  private broadcastMessage(message: ChatMessage) {
    this.server.emit('chat:newMessage', message);
  }
}
