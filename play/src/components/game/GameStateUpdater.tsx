import { useEffect } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { useSocket } from "@/components/SocketContext";
import type { GameState } from "@trabalho-apsoo/shared";

function GameStateUpdater() {
  const setGameState = useGameStore((state) => state.setGameState);
  const { socket } = useSocket();

  useEffect(() => {
    function onGameStateUpdate(newState: GameState) {
      setGameState(newState);
    }

    socket.on("game:state", onGameStateUpdate);

    return () => {
      socket.off("game:state", onGameStateUpdate);
    };
  }, [setGameState, socket]);

  return null;
}

export default GameStateUpdater;