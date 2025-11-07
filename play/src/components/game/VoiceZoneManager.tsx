import { useEffect } from 'react';
import { useGameStore } from '@/stores/useGameStore';
import { useSocket } from '@/components/SocketContext';
import { useRoomContext } from '@livekit/components-react';

export function VoiceZoneManager() {
  const { socket } = useSocket();
  const room = useRoomContext();
  const currentVoiceZone = useGameStore((state) => state.currentVoiceZone);
  const playerId = useGameStore((state) => state.playerId);
  const playersInZones = useGameStore((state) => state.playersInZones);
  const updatePlayerZone = useGameStore((state) => state.updatePlayerZone);

  // Notify server about zone changes
  useEffect(() => {
    if (socket && playerId) {
      socket.emit('player-zone-change', { playerId, zoneId: currentVoiceZone });
    }
  }, [currentVoiceZone, playerId, socket]);

  // Listen for other players' zone changes
  useEffect(() => {
    if (socket) {
      const handlePlayerZoneUpdate = (data: { playerId: string; zoneId: string | null }) => {
        updatePlayerZone(data.playerId, data.zoneId);
      };

      socket.on('player-zone-updated', handlePlayerZoneUpdate);
      
      return () => {
        socket.off('player-zone-updated', handlePlayerZoneUpdate);
      };
    }
  }, [socket, updatePlayerZone]);

  // Apply audio filters based on zones
  useEffect(() => {
    if (!room || !currentVoiceZone) return;

    const currentZonePlayers = playersInZones[currentVoiceZone] || [];
    
    room.remoteParticipants.forEach((participant) => {
      const isInSameZone = currentZonePlayers.includes(participant.identity);
      
      participant.audioTrackPublications.forEach((trackPublication) => {
        if (trackPublication.track) {
          // Mute players not in the same voice zone
          trackPublication.track.setMuted(!isInSameZone);
        }
      });
    });
  }, [room, currentVoiceZone, playersInZones]);

  return null;
}