"use client";

import { Message } from "@/entities/message/model/types";
import { formatRelativeTime } from "@/shared/lib/formatDate";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  isGrouped?: boolean;
}

export default function MessageBubble({
  message,
  isOwn,
  isGrouped = false,
}: MessageBubbleProps) {
  if (message.messageType === "SYSTEM") {
    return (
      <div className="my-2 flex items-center justify-center">
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"} ${
        isGrouped ? "mt-0.5" : "mt-3"
      }`}
    >
      {!isOwn && (
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-600 ${
            isGrouped ? "invisible" : ""
          }`}
        >
          {message.senderName?.charAt(0) || "?"}
        </div>
      )}
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && !isGrouped && (
          <p className="mb-1 text-xs font-medium text-gray-600">
            {message.senderName}
          </p>
        )}
        <div
          className={`rounded-2xl px-3.5 py-2 text-sm ${
            isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
          }`}
        >
          {message.content}
        </div>
        {message.createdAt && (
          <p
            className={`mt-1 text-[10px] text-gray-400 ${
              isOwn ? "text-right" : "text-left"
            }`}
          >
            {formatRelativeTime(message.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}
