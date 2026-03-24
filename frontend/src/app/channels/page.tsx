"use client";

import { useEffect, useState } from "react";
import Header from "@/widgets/header/ui/Header";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";
import ChannelItem from "@/entities/channel/ui/ChannelItem";
import { Channel } from "@/entities/channel/model/types";
import { getChannels } from "@/entities/channel/api/channelApi";
import CreateChannelModal from "@/features/create-channel/ui/CreateChannelModal";

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getChannels();
        setChannels(data);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">채널</h1>
                <p className="mt-1 text-sm text-gray-500">
                  팀 채널에서 회의록을 공유하고 소통하세요.
                </p>
              </div>
              <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                새 채널
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            ) : channels.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
                <p className="text-sm text-gray-400">아직 채널이 없습니다</p>
                <p className="mt-1 text-xs text-gray-400">
                  새 채널을 만들어 팀원들과 소통을 시작하세요
                </p>
              </div>
            ) : (
              <div className="space-y-1 rounded-2xl border border-gray-200 bg-white p-2">
                {channels.map((channel) => (
                  <ChannelItem key={channel.id} channel={channel} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <CreateChannelModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
