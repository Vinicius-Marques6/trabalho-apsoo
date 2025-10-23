import type { GameState } from "@trabalho-apsoo/shared";
import { create } from "zustand";

type Store = {
    playerId?: string;
    gameState: GameState | null;
    setPlayerId: (id: string | undefined) => void;
    setGameState: (state: GameState) => void;
};

export const useGameStore = create<Store>((set) => ({
    playerId: undefined,
    gameState: null,
    setPlayerId: (id) => set({ playerId: id }),
    setGameState: (state) => set({ gameState: state }),
}));
