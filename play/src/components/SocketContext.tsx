import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { type Socket } from "socket.io-client";
import { socket } from "../socket";

type SocketContextType = {
  socket: Socket;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket,
  isConnected: false,
});

function SocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    socket.connect();

    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const value = useMemo(() => ({
    socket,
    isConnected,
  }), [isConnected]);

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
