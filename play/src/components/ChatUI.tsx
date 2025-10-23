import type { ChatMessage } from "@trabalho-apsoo/shared";
import { useEffect, useState, type FormEvent } from "react";
import { useSocket } from "./SocketContext";

function getRandomColor(username: string) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const r = (hash >> 16) & 0xFF;
  const g = (hash >> 8) & 0xFF;
  const b = hash & 0xFF;

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  const factor = brightness < 128 ? 1.5 : 1;
  const nr = Math.min(255, Math.floor(r * factor));
  const ng = Math.min(255, Math.floor(g * factor));
  const nb = Math.min(255, Math.floor(b * factor));

  return `rgb(${nr},${ng},${nb})`;
}

function ChatUI() {
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
    <div className="absolute top-2 right-2 w-80 h-[calc(100%-1rem)] bg-zinc-900/70 rounded-lg z-10 flex flex-col">
      <div className="p-4 h-full overflow-y-auto flex flex-col space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="text-white wrap-break-word">
            <strong style={{ color: getRandomColor(msg.id) }}>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-2 bg-zinc-800 rounded-b-lg flex">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onKeyUp={handleInputKeyUp}
          className="w-full p-2 bg-zinc-700 rounded-lg"
          placeholder="Digite sua mensagem..."
        />
        <button className="ml-2 p-2 bg-blue-500 text-white rounded-lg" type="submit">Send</button>
      </form>
    </div>
  );
}

export default ChatUI;