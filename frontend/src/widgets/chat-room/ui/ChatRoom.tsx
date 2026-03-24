"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSendMessage } from "@/features/send-message/model/useSendMessage";
import { useAuth } from "@/features/auth/model/useAuth";
import { connectStomp, disconnectStomp, getStompClient } from "@/shared/api/socket";
import { apiInstance } from "@/shared/api/instance";
import MessageBubble from "@/entities/message/ui/MessageBubble";
import MessageInput from "@/features/send-message/ui/MessageInput";
import { Message } from "@/entities/message/model/types";
import { formatDate } from "@/shared/lib/formatDate";

type ConnectionStatus = "connecting" | "connected" | "disconnected";

interface ChatRoomProps {
  channelId: string;
}

function shouldGroupMessage(current: Message, previous: Message): boolean {
  if (current.senderId !== previous.senderId) return false;
  const currentTime = new Date(current.createdAt).getTime();
  const previousTime = new Date(previous.createdAt).getTime();
  return currentTime - previousTime < 5 * 60 * 1000;
}

function isSameDay(a: string, b: string): boolean {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default function ChatRoom({ channelId }: ChatRoomProps) {
  const { messages, addMessage, setMessages, clearMessages } = useSendMessage();
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isScrolledUp, setIsScrolledUp] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("connecting");

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setHasNewMessage(false);
    setIsScrolledUp(false);
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distanceFromBottom > 100) {
      setIsScrolledUp(true);
    } else {
      setIsScrolledUp(false);
      setHasNewMessage(false);
    }
  }, []);

  useEffect(() => {
    clearMessages();

    // 기존 메시지 히스토리 로드 (REST API)
    apiInstance
      .get(`/channels/${channelId}/messages?page=0&size=50`)
      .then((res) => {
        const history: Message[] = res.data.content || [];
        // 시간순 정렬 (API는 desc로 반환)
        setMessages([...history].reverse());
      })
      .catch(() => {});

    // STOMP 연결
    const client = connectStomp(
      () => {
        setConnectionStatus("connected");

        // 채널 구독
        client.subscribe(`/topic/channel/${channelId}`, (frame) => {
          try {
            const message: Message = JSON.parse(frame.body);
            addMessage(message);
          } catch (e) {
            console.error("[STOMP] Parse error:", e);
          }
        });
      },
      () => {
        setConnectionStatus("disconnected");
      }
    );

    setConnectionStatus("connecting");

    return () => {
      // 구독 해제 및 연결 종료
      disconnectStomp();
    };
  }, [channelId, addMessage, setMessages, clearMessages]);

  // Auto-scroll or show "new message" button
  useEffect(() => {
    if (messages.length === 0) return;
    if (isScrolledUp) {
      setHasNewMessage(true);
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isScrolledUp]);

  const renderConnectionBanner = () => {
    if (connectionStatus === "connected") return null;
    if (connectionStatus === "connecting") {
      return (
        <div className="flex items-center justify-center bg-yellow-100 px-4 py-2 text-xs font-medium text-yellow-800">
          연결 중...
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center bg-red-100 px-4 py-2 text-xs font-medium text-red-800">
        연결이 끊어졌습니다. 재연결 중...
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {renderConnectionBanner()}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative flex-1 overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-lg">채널의 시작입니다</p>
            <p className="text-sm text-gray-400">
              첫 번째 메시지를 보내보세요!
            </p>
          </div>
        ) : (
          <div>
            {messages.map((message, index) => {
              const previous = index > 0 ? messages[index - 1] : null;
              const isGrouped = previous
                ? shouldGroupMessage(message, previous)
                : false;
              const showDateSeparator =
                previous && !isSameDay(message.createdAt, previous.createdAt);

              return (
                <div key={message.id || index}>
                  {showDateSeparator && (
                    <div className="my-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-gray-200" />
                      <span className="text-xs text-gray-400">
                        {formatDate(message.createdAt)}
                      </span>
                      <div className="h-px flex-1 bg-gray-200" />
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    isOwn={message.senderId === user?.id}
                    isGrouped={isGrouped}
                  />
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {isScrolledUp && hasNewMessage && (
        <div className="relative">
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1.5 text-xs font-medium text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            새 메시지 보기
          </button>
        </div>
      )}

      <MessageInput channelId={channelId} />
    </div>
  );
}
