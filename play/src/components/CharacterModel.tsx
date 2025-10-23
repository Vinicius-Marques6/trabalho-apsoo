import { Capsule, Cone } from "@react-three/drei";
import * as THREE from "three";

export function CharacterModel({ color }: { color: string }) {
  const material = new THREE.MeshStandardMaterial({ color });

  return (
    <>
      <Capsule position={[0, 1, 0]} args={[0.5, 1, 16, 16]} />
      <Cone
        args={[0.2, 0.8, 8]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 1.5, -1]}
        material={material}
      />
    </>
  );
}