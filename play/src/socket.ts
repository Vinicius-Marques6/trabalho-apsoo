import { io, Socket } from "socket.io-client";

const socketUrl = import.meta.env.VITE_BACK_URL || "http://localhost:3000";
export const socket: Socket = io(socketUrl, { autoConnect: false });