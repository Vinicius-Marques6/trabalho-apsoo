import { useGameStore } from "../stores/useGameStore";
import { CharacterModel } from "./CharacterModel";

function RemotePlayer({
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
      <CharacterModel color="cyan" />
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
          <RemotePlayer key={p.id} x={p.x} y={p.y} direction={p.direction} />
        ))}
    </>
  );
}

export default RemotePlayers;