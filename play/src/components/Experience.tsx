import {
  Environment,
  Gltf,
  Grid,
  KeyboardControls,
  type KeyboardControlsEntry,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { useGameStore } from "@/stores/useGameStore";
import { useSocket } from "@/components/SocketContext";
import { Controls } from "@/types";
import PlayerController from "@/components/game/PlayerController";
import GameStateUpdater from "@/components/game/GameStateUpdater";
import RemotePlayers from "@/components/game/RemotePlayers";
import { Physics, RigidBody } from "@react-three/rapier";
import { VoiceZone } from "@/components/game/VoiceZone";
import { VoiceZoneManager } from "@/components/game/VoiceZoneManager";

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
      <VoiceZoneManager />
      <Canvas shadows camera={{ position: [0, 20, 6], fov: 60 }}>
        <color attach="background" args={["white"]} />
        <Environment preset="apartment" />
        <Grid infiniteGrid sectionSize={10} sectionColor={"#9c9c9c"} />
        <Suspense>
          <Physics debug timeStep="vary">
            <RigidBody type="fixed" colliders="trimesh">
              <Gltf src="./Office.glb" position={[0, 0, 0]} scale={1.3} rotation={[0, -Math.PI / 4, 0]} />
            </RigidBody>

            {/* Voice Zones */}
            <VoiceZone 
              position={[5, 1, 5]} 
              size={[2, 2, 2]} 
              zoneId="meeting-room-1" 
            />
            <VoiceZone 
              position={[-5, 1, -5]} 
              size={[2, 2, 2]} 
              zoneId="meeting-room-2" 
            />
            <VoiceZone 
              position={[0, 1, 0]} 
              size={[3, 2, 3]} 
              zoneId="main-hall" 
            />

            <RigidBody type="fixed" position={[2, 1, 2]} rotation={[0, 0, 0]}>
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="orange" />
              </mesh>
            </RigidBody>

            <PlayerController />
            <RemotePlayers />
          </Physics>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  );
}

export default Experience;
