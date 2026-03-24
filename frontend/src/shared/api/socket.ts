import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { config } from "@/shared/config";

let stompClient: Client | null = null;

function getToken(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token") || "";
  }
  return "";
}

export function getStompClient(): Client {
  if (!stompClient) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(`${config.wsUrl}/ws`),
      connectHeaders: {
        Authorization: `Bearer ${getToken()}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[STOMP]", str);
        }
      },
    });
  }
  return stompClient;
}

export function connectStomp(
  onConnect?: () => void,
  onDisconnect?: () => void
): Client {
  const client = getStompClient();

  // 연결 시마다 최신 토큰으로 갱신
  client.connectHeaders = {
    Authorization: `Bearer ${getToken()}`,
  };

  client.onConnect = () => {
    console.log("[STOMP] Connected");
    onConnect?.();
  };

  client.onDisconnect = () => {
    console.log("[STOMP] Disconnected");
    onDisconnect?.();
  };

  client.onStompError = (frame) => {
    console.error("[STOMP] Error:", frame.headers["message"]);
    onDisconnect?.();
  };

  if (!client.active) {
    client.activate();
  }

  return client;
}

export function disconnectStomp(): void {
  if (stompClient?.active) {
    stompClient.deactivate();
  }
}

export type { IMessage };
