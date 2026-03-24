"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import ChannelItem from "@/entities/channel/ui/ChannelItem";
import { Channel } from "@/entities/channel/model/types";
import { getChannels, deleteChannel } from "@/entities/channel/api/channelApi";
import CreateChannelModal from "@/features/create-channel/ui/CreateChannelModal";

export default function Sidebar() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const fetchChannels = async () => {
    try {
      const data = await getChannels();
      setChannels(data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  const handleDelete = async (channelId: string) => {
    try {
      await deleteChannel(channelId);
      setChannels((prev) => prev.filter((c) => String(c.id) !== channelId));
      // 삭제한 채널에 있었으면 대시보드로 이동
      if (pathname.includes(`/channels/${channelId}`)) {
        router.push("/dashboard");
      }
    } catch {
      alert("채널 삭제에 실패했습니다.");
    }
  };

  const currentChannelId = pathname.match(/\/channels\/([^/]+)/)?.[1];

  return (
    <>
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-gray-50">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-sm font-semibold text-gray-900">채널 목록</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {isLoading ? (
          <div className="space-y-2 px-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-gray-200"
              />
            ))}
          </div>
        ) : channels.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-gray-400">
            아직 채널이 없습니다
          </p>
        ) : (
          <div className="space-y-0.5">
            {channels.map((channel) => (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isActive={String(channel.id) === currentChannelId}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
    <CreateChannelModal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); fetchChannels(); }} />
    </>
  );
}
