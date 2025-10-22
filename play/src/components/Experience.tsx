/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Capsule,
  Cone,
  Grid,
  KeyboardControls,
  useKeyboardControls,
  type KeyboardControlsEntry,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGameStore } from "../stores/useGameStore";
import { useSocket } from "./SocketContext";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  jump = "jump",
}

function OtherPlayer({
  x,
  y,
  direction,
}: {
  x: number;
  y: number;
  direction?: number;
}) {
  return (
    <group position={[x, 0, y]} rotation={[0, direction ?? 0, 0]}>
      <Capsule position={[0, 1, 0]} args={[0.5, 1, 16, 16]} />
      <Cone
        args={[0.2, 0.8, 8]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 1.5, -1]}
        material={new THREE.MeshStandardMaterial({ color: "cyan" })}
      />
    </group>
  );
}

function Player() {
  const playerId = useGameStore((state) => state.playerId);
  const playerRef = useRef<THREE.Group>(null);
  const [, get] = useKeyboardControls<Controls>();
  const { camera } = useThree();
  const { socket } = useSocket();

  const speed = 0.1;
  const rotationSpeed = 0.2;
  const cameraOffsetY = 5;
  const cameraOffsetZ = 10;

  // Main game loop
  useFrame(() => {
    if (!playerRef.current) return;

    const { forward, back, left, right } = get();

    const moveVector = new THREE.Vector3();

    // Determine movement direction
    if (forward) moveVector.z -= 1;
    if (back) moveVector.z += 1;
    if (left) moveVector.x -= 1;
    if (right) moveVector.x += 1;

    // Normalize and scale the movement vector
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(speed);
      playerRef.current.position.add(moveVector);

      // Calculate target rotation based on movement direction
      // Math.atan2(y, x) calculates the angle from the positive X-axis to the point (x, y).
      // In our case, we want the angle from the positive Z-axis to the (moveVector.x, moveVector.z) vector.
      // The player's "front" (the cone) is along its local negative Z-axis.
      // To align the player's local negative Z-axis with the moveVector, we add Math.PI to the angle.
      const targetRotation = Math.atan2(moveVector.x, moveVector.z) + Math.PI;

      const currentRotation = playerRef.current.rotation.y;
      let angleDiff = targetRotation - currentRotation;

      // Normalize angleDiff to the range [-PI, PI]
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      // Smoothly interpolate the current rotation towards the target rotation
      playerRef.current.rotation.y += angleDiff * rotationSpeed;
    }

    if (playerId) {
      socket.emit("move", {
        x: playerRef.current.position.x,
        y: playerRef.current.position.z,
        direction: playerRef.current.rotation.y,
      });
    }

    // Update camera position to follow the player
    const playerPosition = playerRef.current.position;
    const cameraOffset = new THREE.Vector3(0, cameraOffsetY, cameraOffsetZ);
    const newCameraPosition = playerPosition.clone().add(cameraOffset);

    camera.position.copy(newCameraPosition);
    camera.lookAt(playerPosition);
  });

  return (
    <>
      <group ref={playerRef}>
        <Capsule position={[0, 1, 0]} args={[0.5, 1, 16, 16]} />
        <Cone
          args={[0.2, 0.8, 8]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 1.5, -1]}
          material={new THREE.MeshStandardMaterial({ color: "hotpink" })}
        />
      </group>
    </>
  );
}

function GameStateUpdater() {
  const setGameState = useGameStore((state) => state.setGameState);
  const { socket } = useSocket();

  useEffect(() => {
    function onGameStateUpdate(newState: any) {
      setGameState(newState);
    }

    socket.on("state", onGameStateUpdate);

    return () => {
      socket.off("state", onGameStateUpdate);
    };
  }, [setGameState, socket]);

  return null;
}

export function Experience() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
      { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
      { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
      { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
      { name: Controls.jump, keys: ["Space"] },
    ],
    []
  );

  const { socket, isConnected } = useSocket();
  const playerId = useGameStore((state) => state.playerId);
  const gameState = useGameStore((state) => state.gameState); // Fix this line, it's causing re-render each time the state updates

  useEffect(() => {
    if (isConnected) {
      console.log("Connected with ID:", socket.id);
      socket.emit("join", { name: "Jogador" });
      
      useGameStore.getState().setPlayerId(socket.id);
    }
  }, [isConnected, socket]);

  return (

    <KeyboardControls map={map}>
      <GameStateUpdater />
      <Canvas shadows camera={{ position: [0, 20, 6], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <Grid infiniteGrid sectionSize={10} sectionColor={"#9c9c9c"} />
        <Player />
        {gameState?.players
          ?.filter((p: any) => p.id !== playerId)
          .map((p: any) => (
            <OtherPlayer key={p.id} x={p.x} y={p.y} direction={p.direction} />
          ))}
      </Canvas>
    </KeyboardControls>
  );
}

export default Experience;
