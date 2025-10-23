import { useEffect } from "react";
import { useGameStore } from "../stores/useGameStore";
import { useSocket } from "./SocketContext";
import type { GameState } from "@trabalho-apsoo/shared";

function GameStateUpdater() {
  const setGameState = useGameStore((state) => state.setGameState);
  const { socket } = useSocket();

  useEffect(() => {
    function onGameStateUpdate(newState: GameState) {
      setGameState(newState);
    }

    socket.on("state", onGameStateUpdate);

    return () => {
      socket.off("state", onGameStateUpdate);
    };
  }, [setGameState, socket]);

  return null;
}

export default GameStateUpdater;