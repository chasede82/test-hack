import { io, Socket } from "socket.io-client";
import { config } from "@/shared/config";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(config.wsUrl, {
      autoConnect: false,
      auth: {
        token:
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null,
      },
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
