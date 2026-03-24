"use client";

import { useEffect, useRef } from "react";
import { useSendMessage } from "@/features/send-message/model/useSendMessage";
import { useAuth } from "@/features/auth/model/useAuth";
import { getSocket, connectSocket } from "@/shared/api/socket";
import MessageBubble from "@/entities/message/ui/MessageBubble";
import MessageInput from "@/features/send-message/ui/MessageInput";
import { Message } from "@/entities/message/model/types";

interface ChatRoomProps {
  channelId: string;
}

export default function ChatRoom({ channelId }: ChatRoomProps) {
  const { messages, addMessage, joinChannel, leaveChannel, setMessages } =
    useSendMessage();
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectSocket();
    const socket = getSocket();

    joinChannel(channelId);

    socket.on("message:new", (message: Message) => {
      addMessage(message);
    });

    socket.on("channel:history", (history: Message[]) => {
      setMessages(history);
    });

    return () => {
      leaveChannel(channelId);
      socket.off("message:new");
      socket.off("channel:history");
    };
  }, [channelId, addMessage, joinChannel, leaveChannel, setMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-gray-400">
              아직 메시지가 없습니다. 첫 번째 메시지를 보내보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === user?.id}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <MessageInput channelId={channelId} />
    </div>
  );
}
