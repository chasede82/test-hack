"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { useSendMessage } from "@/features/send-message/model/useSendMessage";

interface MessageInputProps {
  channelId: string;
}

const EMOJI_LIST = ["😀", "😂", "😍", "🤔", "👍", "👎", "🎉", "🔥", "💯", "❤️", "👏", "🙏"];
const MAX_LENGTH = 2000;
const CHAR_COUNT_THRESHOLD = 1500;

export default function MessageInput({ channelId }: MessageInputProps) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { sendTextMessage } = useSendMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 20;
    const minHeight = lineHeight * 1;
    const maxHeight = lineHeight * 5;
    el.style.height = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight) + "px";
  };

  const resetHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    sendTextMessage(channelId, trimmed);
    setText("");
    setShowEmoji(false);
    resetHeight();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_LENGTH) return;
    setText(value);
    adjustHeight();
  };

  const insertEmoji = (emoji: string) => {
    if (text.length >= MAX_LENGTH) return;
    setText((prev) => {
      const next = prev + emoji;
      return next.length > MAX_LENGTH ? prev : next;
    });
    textareaRef.current?.focus();
    setTimeout(adjustHeight, 0);
  };

  const showCharCount = text.length >= CHAR_COUNT_THRESHOLD;
  const remaining = MAX_LENGTH - text.length;

  return (
    <div className="relative border-t border-gray-200 bg-white p-3">
      {showEmoji && (
        <div className="absolute bottom-full left-3 mb-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <div className="grid grid-cols-6 gap-1">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                className="rounded-lg p-1.5 text-xl hover:bg-gray-100 transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
      {showCharCount && (
        <div className="mb-1 text-right text-xs text-gray-400">
          {remaining.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
        </div>
      )}
      <div className="flex items-end gap-2">
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className="flex-1 resize-none overflow-y-auto rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ minHeight: "36px", maxHeight: "100px", lineHeight: "20px" }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="rounded-lg bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
