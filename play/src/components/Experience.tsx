import {
  Grid,
  KeyboardControls,
  type KeyboardControlsEntry,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { useGameStore } from "../stores/useGameStore";
import { useSocket } from "./SocketContext";
import { Controls } from "../types";
import PlayerController from "./PlayerController";
import GameStateUpdater from "./GameStateUpdater";
import RemotePlayers from "./RemotePlayers";

export function Experience() {
  const map: KeyboardControlsEntry<Controls>[] = [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.jump, keys: ["Space"] },
  ];

  const { socket, isConnected } = useSocket();
  const setPlayerId = useGameStore((state) => state.setPlayerId);

  useEffect(() => {
    if (isConnected) {
      console.log("Connected with ID:", socket.id);
      setPlayerId(socket.id);
    }
  }, [isConnected, setPlayerId, socket]);

  return (
    <KeyboardControls map={map}>
      <GameStateUpdater />
      <Canvas shadows camera={{ position: [0, 20, 6], fov: 60 }}>
        <color attach="background" args={["white"]} />
        <ambientLight intensity={0.5} />
        <Grid infiniteGrid sectionSize={10} sectionColor={"#9c9c9c"} />
        <PlayerController />
        <RemotePlayers />
      </Canvas>
    </KeyboardControls>
  );
}

export default Experience;
