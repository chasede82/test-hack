"use client";

import { Channel } from "@/entities/channel/model/types";
import { formatRelativeTime } from "@/shared/lib/formatDate";
import Link from "next/link";

interface ChannelItemProps {
  channel: Channel;
  isActive?: boolean;
}

export default function ChannelItem({ channel, isActive }: ChannelItemProps) {
  return (
    <Link href={`/channels/${channel.id}`}>
      <div
        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
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
          {channel.lastMessageAt && (
            <p className="truncate text-xs text-gray-400">
              {formatRelativeTime(channel.lastMessageAt)}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-400">{channel.memberCount}명</span>
      </div>
    </Link>
  );
}
