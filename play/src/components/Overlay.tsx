import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import ChatPanel from './ChatPanel';

export default function Overlay() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`absolute top-2 left-2 pointer-events-auto bg-background/50 hover:bg-background/70 text-primary p-3 transition-all ${isChatOpen ? 'invisible' : ''}`}
        size="icon"
      >
        <MessageCircle className="size-4" />
      </Button>
      <div
        className={`absolute left-0 top-0 h-full w-90 transform transition-transform duration-300 pointer-events-auto p-2 ${
          isChatOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full">
          <Button
            onClick={() => setIsChatOpen(false)}
            className="absolute top-2 right-2 z-10 bg-background hover:bg-background/80 text-primary p-2"
            size="icon"
          >
            <X />
          </Button>
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
