import { Injectable } from '@nestjs/common';
import { GameState } from '@trabalho-apsoo/shared';

@Injectable()
export class GameService {
  private state: GameState = { players: [] };

  getState() {
    return this.state;
  }

  addPlayer(id: string, name: string) {
    this.state.players.push({ id, name, x: 0, y: 0 });
  }

  removePlayer(id: string) {
    this.state.players = this.state.players.filter(
      (player) => player.id !== id,
    );
  }

  updateMovement(id: string, x: number, y: number, direction: number) {
    const player = this.state.players.find((p) => p.id === id);
    if (player) {
      player.x = x;
      player.y = y;
      player.direction = direction;
    }
  }
}
