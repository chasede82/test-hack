"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Channel } from "@/entities/channel/model/types";

interface ChannelItemProps {
  channel: Channel;
  isActive?: boolean;
  onDelete?: (channelId: string) => void;
}

export default function ChannelItem({ channel, isActive, onDelete }: ChannelItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (!showConfirm) {
      router.push(`/channels/${channel.id}`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(String(channel.id));
    setShowConfirm(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
        <p className="mb-2 text-xs text-red-700">&apos;{channel.name}&apos; 채널을 삭제하시겠습니까?</p>
        <div className="flex gap-2">
          <button
            onClick={confirmDelete}
            className="flex-1 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
          >
            삭제
          </button>
          <button
            onClick={cancelDelete}
            className="flex-1 rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-300"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
        isActive
          ? "bg-blue-50 text-blue-700"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-200 text-sm font-medium text-gray-600">
        #
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{channel.name}</p>
      </div>
      <button
        onClick={handleDelete}
        className="hidden rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600 group-hover:block transition-colors"
        title="채널 삭제"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
