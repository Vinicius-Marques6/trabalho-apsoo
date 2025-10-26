import { useState, type FormEvent } from 'react';
import './App.css';
import Experience from './components/Experience';
import { useSocket } from './components/SocketContext';
import ChatUI from './components/ChatUI';
import { RoomAudioRenderer, RoomContext, TrackToggle } from '@livekit/components-react';
import { Room, Track } from 'livekit-client';
import api from './api';

function JoinGameForm({ onJoin }: { onJoin: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-900'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-6 bg-gray-800 rounded-lg'>
        <h2 className='text-white text-lg'>Escolha seu nome</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome..."
          className='p-2 bg-gray-700 rounded-lg'
          autoFocus
        />
        <button type="submit" className='p-2 bg-blue-500 text-white rounded-lg'>
          Entrar no Jogo
        </button>
      </form>
    </div>
  );
}

function App() {
  const { socket } = useSocket();
  const [hasJoined, setHasJoined] = useState(false);
  const [room] = useState(() => new Room());

  const handleJoin = async (name: string) => {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

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

  if (!hasJoined) {
    return <JoinGameForm onJoin={handleJoin} />;
  }

  return (
    <>
      <RoomContext.Provider value={room}>
        <ControlBar />
        <RoomAudioRenderer />
        <ChatUI />
        <Experience />
      </RoomContext.Provider>
    </>
  );
}

function ControlBar() {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10 bg-gray-200 bg-opacity-50 p-4 rounded-lg">
      <TrackToggle source={Track.Source.Microphone} />
      <TrackToggle source={Track.Source.Camera} />
    </div>
  );
}

export default App;
