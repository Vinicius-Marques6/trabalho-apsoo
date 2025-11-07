import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useGameStore } from "@/stores/useGameStore";

interface VoiceZoneProps {
  position: [number, number, number];
  size: [number, number, number];
  zoneId: string;
  children?: React.ReactNode;
}

export function VoiceZone({ position, size, zoneId, children }: VoiceZoneProps) {
  const setCurrentVoiceZone = useGameStore((state) => state.setCurrentVoiceZone);
  const playerId = useGameStore((state) => state.playerId);

  const handleEnter = () => {
    console.log(`Player ${playerId} entered voice zone: ${zoneId}`);
    setCurrentVoiceZone(zoneId);
  };

  const handleExit = () => {
    console.log(`Player ${playerId} left voice zone: ${zoneId}`);
    setCurrentVoiceZone(null);
  };

  return (
    <RigidBody colliders={false} type="fixed" sensor onIntersectionEnter={handleEnter} onIntersectionExit={handleExit}>
      <CuboidCollider args={size} position={position} />
      {children}
    </RigidBody>
  );
}