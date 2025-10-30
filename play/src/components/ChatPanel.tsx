import { useEffect, useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocket } from './SocketContext';
import type { ChatMessage } from '@trabalho-apsoo/shared';
import { getRandomColor } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatPanel() {
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
    <div className="w-full h-full flex flex-col rounded shadow-xl bg-background/50 backdrop-blur-sm overflow-hidden">
      <div className="py-3 px-4 border-b bg-background/50">
        <div className="text-lg font-semibold text-white flex items-center gap-2">
            <div className='size-3 bg-green-600 rounded-full'></div>
          Chat em Tempo Real
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 px-4 overflow-y-auto">
          <div className="space-y-3 py-3">
            {messages.map((msg, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className="min-w-8 min-h-8 size-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: getRandomColor(msg.id) }}
                >
                  {(msg.username || 'A').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">{msg.username || 'Anônimo'}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-white rounded px-2 py-2 shadow-sm border">
                    <p className="text-slate-800 wrap-break-word">{msg.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t bg-background/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleInputKeyDown}
              onKeyUp={handleInputKeyUp}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}