import { create } from "zustand";

type GameState = {
    players: Array<{ id: string; x: number; y: number; direction?: number }>;
};

type Store = {
    playerId?: string;
    gameState: GameState | null;
    setPlayerId: (id: string) => void;
    setGameState: (state: GameState) => void;
};

export const useGameStore = create<Store>((set) => ({
    playerId: undefined,
    gameState: null,
    setPlayerId: (id) => set({ playerId: id }),
    setGameState: (state) => set({ gameState: state }),
}));
