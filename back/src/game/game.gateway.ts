import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly gameService: GameService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    this.broadcastState();
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.gameService.removePlayer(client.id);
    this.broadcastState();
  }

  @SubscribeMessage('game:join')
  handleJoin(client: Socket, payload: { name: string }) {
    this.gameService.addPlayer(client.id, payload.name);
    this.broadcastState();
  }

  @SubscribeMessage('game:move')
  handleMove(
    client: Socket,
    payload: { x: number; y: number; direction: number },
  ) {
    this.gameService.updateMovement(
      client.id,
      payload.x,
      payload.y,
      payload.direction,
    );
    this.broadcastState();
  }

  @SubscribeMessage('player-zone-change')
  handlePlayerZoneChange(client: Socket, payload: { zoneId: string }) {
    this.server.emit('player-zone-updated', payload);
  }

  private broadcastState() {
    this.server.emit('game:state', this.gameService.getState());
  }
}
