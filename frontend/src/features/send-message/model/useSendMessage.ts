import { create } from "zustand";
import { Message } from "@/entities/message/model/types";
import { getStompClient } from "@/shared/api/socket";

interface SendMessageState {
  messages: Message[];
  addMessage: (message: Message) => void;
  sendTextMessage: (channelId: string, content: string) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
}

export const useSendMessage = create<SendMessageState>((set) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => {
      // 중복 방지
      if (state.messages.some((m) => m.id === message.id)) return state;
      return { messages: [...state.messages, message] };
    }),

  sendTextMessage: (channelId, content) => {
    const client = getStompClient();
    if (client.active) {
      client.publish({
        destination: `/app/chat.send/${channelId}`,
        body: JSON.stringify({ content, messageType: "TEXT" }),
      });
    }
  },

  setMessages: (messages) => set({ messages }),
  clearMessages: () => set({ messages: [] }),
}));
