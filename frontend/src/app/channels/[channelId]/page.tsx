"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/widgets/header/ui/Header";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";
import ChatRoom from "@/widgets/chat-room/ui/ChatRoom";
import MeetingCard from "@/entities/meeting/ui/MeetingCard";
import { Meeting } from "@/entities/meeting/model/types";
import { Channel } from "@/entities/channel/model/types";
import { getMeetings } from "@/entities/meeting/api/meetingApi";
import { getChannel } from "@/entities/channel/api/channelApi";
import UploadRecordingModal from "@/features/upload-recording/ui/UploadRecordingModal";
import { useUploadRecording } from "@/features/upload-recording/model/useUploadRecording";
import AudioRecorder from "@/features/record-audio/ui/AudioRecorder";
import Button from "@/shared/ui/Button";

export default function ChannelDetailPage() {
  const params = useParams();
  const channelId = params.channelId as string;
  const [channel, setChannel] = useState<Channel | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "meetings" | "record">(
    "chat"
  );
  const { openModal } = useUploadRecording();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [channelData, meetingsData] = await Promise.all([
          getChannel(channelId),
          getMeetings(channelId),
        ]);
        setChannel(channelData);
        setMeetings(meetingsData);
      } catch {
        // silently fail
      }
    };
    fetchData();
  }, [channelId]);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Channel header */}
          <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                # {channel?.name || "..."}
              </h1>
              {channel?.description && (
                <p className="text-xs text-gray-500">{channel.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={openModal}>
                녹음 업로드
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white px-6">
            {[
              { key: "chat" as const, label: "채팅" },
              { key: "meetings" as const, label: "회의 목록" },
              { key: "record" as const, label: "실시간 녹음" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" && <ChatRoom channelId={channelId} />}

            {activeTab === "meetings" && (
              <div className="h-full overflow-y-auto p-6">
                {meetings.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-gray-400">
                      이 채널에 아직 회의 기록이 없습니다
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto max-w-2xl space-y-3">
                    {meetings.map((meeting) => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "record" && (
              <div className="flex h-full items-center justify-center p-6">
                <div className="w-full max-w-md">
                  <h2 className="mb-4 text-center text-lg font-semibold text-gray-900">
                    실시간 녹음
                  </h2>
                  <p className="mb-6 text-center text-sm text-gray-500">
                    브라우저 마이크를 사용하여 회의를 직접 녹음하세요
                  </p>
                  <AudioRecorder />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <UploadRecordingModal channelId={channelId} />
    </div>
  );
}
