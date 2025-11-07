import type { GameState } from "@trabalho-apsoo/shared";
import { create } from "zustand";

type Store = {
  playerId?: string;
  setPlayerId: (id: string | undefined) => void;
  currentVoiceZone: string | null;
  setCurrentVoiceZone: (zone: string | null) => void;
  gameState: GameState | null;
  setGameState: (state: GameState) => void;
  playersInZones: Record<string, string[]>; // zoneId -> playerIds
  updatePlayerZone: (playerId: string, zoneId: string | null) => void;
};

export const useGameStore = create<Store>((set) => ({
  playerId: undefined,
  gameState: null,
  currentVoiceZone: null,
  playersInZones: {},

  setCurrentVoiceZone: (zoneId) => set({ currentVoiceZone: zoneId }),
  setPlayerId: (id) => set({ playerId: id }),
  setGameState: (state) => set({ gameState: state }),

  updatePlayerZone: (playerId, zoneId) =>
    set((state) => {
      const newPlayersInZones = { ...state.playersInZones };

      // Remove player from all zones
      Object.keys(newPlayersInZones).forEach((zone) => {
        newPlayersInZones[zone] = newPlayersInZones[zone].filter(
          (id) => id !== playerId
        );
      });

      // Add player to new zone
      if (zoneId) {
        if (!newPlayersInZones[zoneId]) {
          newPlayersInZones[zoneId] = [];
        }
        newPlayersInZones[zoneId].push(playerId);
      }

      return { playersInZones: newPlayersInZones };
    }),
}));
