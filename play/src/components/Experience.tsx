import {
  Environment,
  Gltf,
  Grid,
  KeyboardControls,
  type KeyboardControlsEntry,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { useSocket } from "@/components/SocketContext";
import { Controls } from "@/types";
import PlayerController from "@/components/game/PlayerController";
import GameStateUpdater from "@/components/game/GameStateUpdater";
import RemotePlayers from "@/components/game/RemotePlayers";
import { Physics, RigidBody } from "@react-three/rapier";

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
        <Environment preset="apartment" />
        <Grid infiniteGrid sectionSize={10} sectionColor={"#9c9c9c"} />
        <Physics debug>
          <RigidBody type="fixed" colliders="trimesh">
            <Gltf src="./Office.glb" position={[0, 0, 0]} scale={1.3} />
          </RigidBody>
          <PlayerController />
          <RemotePlayers />
        </Physics>
      </Canvas>
    </KeyboardControls>
  );
}

export default Experience;
