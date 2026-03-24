"use client";

import { Message } from "@/entities/message/model/types";
import { formatRelativeTime } from "@/shared/lib/formatDate";
import Link from "next/link";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {!isOwn && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-300 text-xs font-medium text-gray-600">
          {message.senderName.charAt(0)}
        </div>
      )}
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && (
          <p className="mb-1 text-xs font-medium text-gray-600">
            {message.senderName}
          </p>
        )}
        {message.type === "meeting_minutes" && message.meetingId ? (
          <Link href={`/meetings/${message.meetingId}`}>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 transition-colors hover:bg-blue-100">
              <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-blue-700">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                회의록 공유
              </div>
              <p className="text-sm text-gray-800">{message.content}</p>
            </div>
          </Link>
        ) : (
          <div
            className={`rounded-2xl px-3.5 py-2 text-sm ${
              isOwn
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {message.content}
          </div>
        )}
        <p
          className={`mt-1 text-[10px] text-gray-400 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          {formatRelativeTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
