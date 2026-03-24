import { create } from "zustand";
import { getSocket } from "@/shared/api/socket";
import { Message } from "@/entities/message/model/types";

interface SendMessageState {
  messages: Message[];
  isConnected: boolean;
  addMessage: (message: Message) => void;
  sendTextMessage: (channelId: string, content: string) => void;
  shareMeetingMinutes: (channelId: string, meetingId: string, title: string) => void;
  joinChannel: (channelId: string) => void;
  leaveChannel: (channelId: string) => void;
  setMessages: (messages: Message[]) => void;
  setConnected: (connected: boolean) => void;
}

export const useSendMessage = create<SendMessageState>((set) => ({
  messages: [],
  isConnected: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  sendTextMessage: (channelId, content) => {
    const socket = getSocket();
    socket.emit("message:send", { channelId, content, type: "text" });
  },

  shareMeetingMinutes: (channelId, meetingId, title) => {
    const socket = getSocket();
    socket.emit("message:send", {
      channelId,
      content: title,
      type: "meeting_minutes",
      meetingId,
    });
  },

  joinChannel: (channelId) => {
    const socket = getSocket();
    socket.emit("channel:join", { channelId });
  },

  leaveChannel: (channelId) => {
    const socket = getSocket();
    socket.emit("channel:leave", { channelId });
  },

  setMessages: (messages) => set({ messages }),
  setConnected: (connected) => set({ isConnected: connected }),
}));
