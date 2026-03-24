import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { config } from "@/shared/config";

let stompClient: Client | null = null;

export function getStompClient(): Client {
  if (!stompClient) {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(`${config.wsUrl}/ws`),
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
