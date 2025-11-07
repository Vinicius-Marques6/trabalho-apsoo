import { Billboard, useKeyboardControls, Text } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Controls } from "@/types";
import { useGameStore } from "@/stores/useGameStore";
import { useSocket } from "@/components/SocketContext";
import * as THREE from "three";
import { CharacterModel } from "@/components/game/CharacterModel";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";

function PlayerController() {
  const playerId = useGameStore((state) => state.playerId);
  const player = useGameStore((state) =>
    state.gameState?.players.find((p) => p.id === playerId)
  );
  // const playerRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const rigidBodyRef = useRef<any>(null);
  const [, get] = useKeyboardControls<Controls>();
  const { camera } = useThree();
  const { socket } = useSocket();

  const speed = 0.1;
  const rotationSpeed = 0.2;
  const cameraOffsetX = 0;
  const cameraOffsetY = 15;
  const cameraOffsetZ = 10;

  // Main game loop
  useFrame((_, delta) => {
    if (!rigidBodyRef.current || !modelRef.current) return;

    const { forward, back, left, right } = get();

    const moveVector = new THREE.Vector3();

    // Determine movement direction
    if (forward) moveVector.z -= 1;
    if (back) moveVector.z += 1;
    if (left) moveVector.x -= 1;
    if (right) moveVector.x += 1;

    // Normalize and scale the movement vector
    if (moveVector.length() > 0) {
      moveVector.normalize().multiplyScalar(speed * delta * 60);
      //playerRef.current.position.add(moveVector);

      const curentPost = rigidBodyRef.current.translation();
      const newPos = {
        x: curentPost.x + moveVector.x,
        y: curentPost.y,
        z: curentPost.z + moveVector.z,
      };
      rigidBodyRef.current.setTranslation(newPos, true);  

      // Calculate target rotation based on movement direction
      // Math.atan2(y, x) calculates the angle from the positive X-axis to the point (x, y).
      // In our case, we want the angle from the positive Z-axis to the (moveVector.x, moveVector.z) vector.
      // The player's "front" (the cone) is along its local negative Z-axis.
      // To align the player's local negative Z-axis with the moveVector, we add Math.PI to the angle.
      const targetRotation = Math.atan2(moveVector.x, moveVector.z) + Math.PI;

      const currentRotation = modelRef.current.rotation.y;
      const normalizedCurrentRotation = currentRotation % (2 * Math.PI);
      let angleDiff = targetRotation - normalizedCurrentRotation;

      // Normalize angleDiff to the range [-PI, PI]
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;

      // Smoothly interpolate the current rotation towards the target rotation
      modelRef.current.rotation.y += angleDiff * rotationSpeed;
    }

    if (playerId && rigidBodyRef.current) {
      const pos = rigidBodyRef.current.translation();
      socket.emit("game:move", {
        x: pos.x,
        y: pos.z,
        direction: modelRef.current.rotation.y,
      });
    }

    // Update camera position to follow the player
    const playerPosition = rigidBodyRef.current.translation();
    const cameraOffset = new THREE.Vector3(cameraOffsetX, cameraOffsetY, cameraOffsetZ);
    const newCameraPosition = new THREE.Vector3(
      playerPosition.x,
      playerPosition.y,
      playerPosition.z
    ).add(cameraOffset);

    camera.position.copy(newCameraPosition);
    camera.lookAt(
      new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z)
    );
  });

  return (
    <RigidBody
    ref={rigidBodyRef}
    colliders={false}
    lockRotations
  >
    <group ref={modelRef}>
      <CharacterModel color="hotpink" />
      <Billboard position={[0, 2.5, 0]}>
        <Text fontSize={0.5} color="white" outlineWidth={0.05} outlineColor="black">
          {player?.name || "Player"}
        </Text>
      </Billboard>
    </group>
    <CapsuleCollider args={[0.5, 0.5]} position={[0, 1, 0]} />
  </RigidBody>
  );
}

export default PlayerController;