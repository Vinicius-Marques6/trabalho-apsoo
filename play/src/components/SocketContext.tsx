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

  const handleConnect = () => {
    setIsConnected(true);
    console.log("Socket connected:", socket.id);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    console.log("Socket disconnected");
  }

  useEffect(() => {
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    socket.connect();

    return () => {
      socket.disconnect();
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
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
