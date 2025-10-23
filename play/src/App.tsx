import { useState, type FormEvent } from 'react';
import './App.css';
import Experience from './components/Experience';
import SocketProvider, { useSocket } from './components/SocketContext';
import ChatUI from './components/ChatUI';

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

function Game() {
  const { socket } = useSocket();
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoin = (name: string) => {
    socket.emit('game:join', { name });
    setHasJoined(true);
  };

  if (!hasJoined) {
    return <JoinGameForm onJoin={handleJoin} />;
  }

  return (
    <>
      <ChatUI />
      <Experience />
    </>
  );
}

function App() {
  return (
    <>
      <SocketProvider>
        <Game />
      </SocketProvider>
    </>
  )
}

export default App;
