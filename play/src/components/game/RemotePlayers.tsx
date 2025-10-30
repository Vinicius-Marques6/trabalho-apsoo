import { useGameStore } from "@/stores/useGameStore";
import { CharacterModel } from "@/components/game/CharacterModel";
import { Billboard, Text } from "@react-three/drei";

function RemotePlayer({
  x,
  y,
  direction,
  name,
}: {
  x: number;
  y: number;
  direction?: number;
  name: string;
}) {
  return (
    <group position={[x, 0, y]}>
      <Billboard position={[0, 2.5, 0]}>
        <Text fontSize={0.5} color="white" outlineWidth={0.05} outlineColor="black">
          {name}
        </Text>
      </Billboard>
      <group rotation={[0, direction ?? 0, 0]}>
        <CharacterModel color="cyan" />
      </group>
    </group>
  );
}

function RemotePlayers() {
  const playerId = useGameStore((state) => state.playerId);
  const players = useGameStore((state) => state.gameState?.players);

  return (
    <>
      {players
        ?.filter((p) => p.id !== playerId)
        .map((p) => (
          <RemotePlayer key={p.id} x={p.x} y={p.y} direction={p.direction} name={p.name} />
        ))}
    </>
  );
}

export default RemotePlayers;