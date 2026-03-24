import { io, Socket } from "socket.io-client";
import { config } from "@/shared/config";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(config.wsUrl, {
      autoConnect: false,
      // 자동 재연결 비활성화 - BE가 STOMP WebSocket을 사용하므로 socket.io 연결 시도를 억제
      reconnection: false,
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
  // STOMP WebSocket과 호환되지 않으므로 연결하지 않음
  // 채팅 기능은 추후 STOMP 클라이언트로 전환 필요
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}
