import { useState, type FormEvent } from 'react';
import './App.css';
import Experience from '@/components/Experience';
import { useSocket } from '@/components/SocketContext';
import { RoomAudioRenderer, RoomContext, TrackToggle } from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import api from './api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import Overlay from '@/components/Overlay';
import TitleBar from '@/components/desktop/TitleBar';

function JoinGameForm({ onJoin }: { onJoin: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div className='flex justify-center items-center h-full bg-linear-to-br from-background via-secondary to-background'>
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Entrar no Jogo</CardTitle>
          <CardDescription>
            Escolha seu nome para começar a aventura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className="space-y-2">
              <Label htmlFor="name" className="">
                Nome do Jogador
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome..."
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!name.trim()}
            >
              Entrar no Jogo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  const { socket } = useSocket();
  const [hasJoined, setHasJoined] = useState(false);
  const [room] = useState(() => new Room());

  const handleJoin = async (name: string) => {
    const response = await api.get('/livekit/token', {
      params: {
        id: socket.id,
        name: name,
      }
    });

    socket.emit('game:join', { name });

    await room.connect(import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880', response.data.token);

    setHasJoined(true);

    return () => {
      room.disconnect();
    };
  };

  return (
    <div className='overflow-hidden h-screen w-screen flex flex-col'>
      {window.electronAPI && <TitleBar />}
      <div className="flex-1 relative">
        {!hasJoined ? (
          <JoinGameForm onJoin={handleJoin} />
        ) : (
          <RoomContext.Provider value={room}>
            <ControlBar />
            <RoomAudioRenderer />
            <Overlay />
            <div className="absolute inset-0">
              <Experience />
            </div>
          </RoomContext.Provider>
        )}
      </div>
    </div>
  );
}

function ControlBar() {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10 bg-gray-800/50 backdrop-blur-sm p-2 rounded-lg">
      <TrackToggle source={Track.Source.Microphone} />
      <TrackToggle source={Track.Source.Camera} />
    </div>
  );
}

export default App;
