export interface Player {
  id: string;
  name: string;
  x: number;
  y: number;
  direction?: number;
}

export interface GameState {
  players: Player[];
}

export interface ChatMessage {
  id: string;
  username?: string;
  message: string;
  timestamp: string;
}