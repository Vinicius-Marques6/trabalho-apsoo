import { useEffect, useState, type FormEvent } from 'react';
import './App.css'
import Experience from './components/Experience'
import SocketProvider, { useSocket } from './components/SocketContext'
import type { ChatMessage } from '@trabalho-apsoo/shared';

// TODO: Separation of concerns: Move Chat and JoinGameForm to their own files.
function Chat() {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  const handleInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: ChatMessage) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('chat:newMessage', handleNewMessage);

    return () => {
      socket.off('chat:newMessage', handleNewMessage);
    };
  }, [socket]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() === '') return;

    socket.emit('chat:sendMessage', { message: currentMessage });
    setCurrentMessage('');
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageList}>
        {messages.map((msg, index) => (
          <div key={index} style={styles.messageItem}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={styles.chatForm}>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={styles.chatInput}
          onKeyDown={handleInputKeyDown}
          onKeyUp={handleInputKeyUp}
        />
        <button type="submit" style={styles.sendButton}>Enviar</button>
      </form>
    </div>
  );
}

function JoinGameForm({ onJoin }: { onJoin: (name: string) => void }) {
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onJoin(name.trim());
    }
  };

  return (
    <div style={styles.joinContainer}>
      <form onSubmit={handleSubmit} style={styles.joinForm}>
        <h2>Escolha seu nome</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome..."
          style={styles.chatInput}
          autoFocus
        />
        <button type="submit" style={styles.sendButton}>
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
      <Chat />
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

export default App

const styles: { [key: string]: React.CSSProperties } = {
  joinContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#282c34',
  },
  joinForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: 'white',
  },
  chatContainer: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    width: '300px',
    height: '200px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '8px',
    zIndex: 100,
  },
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
  },
  messageItem: {
    marginBottom: '5px',
  },
  chatForm: {
    display: 'flex',
    padding: '5px',
  },
  chatInput: {
    flex: 1,
    border: 'none',
    padding: '8px',
    borderRadius: '4px',
  },
  sendButton: {
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px',
    marginLeft: '5px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
