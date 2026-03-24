"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/widgets/header/ui/Header";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";
import MeetingMinutesViewer from "@/widgets/meeting-minutes-viewer/ui/MeetingMinutesViewer";
import Badge from "@/shared/ui/Badge";
import { Meeting } from "@/entities/meeting/model/types";
import { getMeeting } from "@/entities/meeting/api/meetingApi";
import { formatDateTime } from "@/shared/lib/formatDate";
import { formatDuration } from "@/shared/lib/formatDuration";

const statusMap: Record<
  Meeting["status"],
  { label: string; variant: "default" | "success" | "warning" | "error" | "info" }
> = {
  uploading: { label: "업로드 중", variant: "info" },
  processing: { label: "AI 분석 중", variant: "warning" },
  completed: { label: "완료", variant: "success" },
  failed: { label: "실패", variant: "error" },
};

export default function MeetingDetailPage() {
  const params = useParams();
  const meetingId = params.meetingId as string;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMeeting(meetingId);
        setMeeting(data);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [meetingId]);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
              </div>
            ) : meeting ? (
              <>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {meeting.title}
                    </h1>
                    <Badge
                      label={statusMap[meeting.status].label}
                      variant={statusMap[meeting.status].variant}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                    <span>{formatDateTime(meeting.createdAt)}</span>
                    {meeting.duration && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{formatDuration(meeting.duration)}</span>
                      </>
                    )}
                  </div>
                </div>

                {meeting.status === "processing" && (
                  <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-center">
                    <div className="mb-2 text-2xl">🔄</div>
                    <p className="text-sm font-medium text-yellow-800">
                      AI가 회의록을 생성하고 있습니다
                    </p>
                    <p className="mt-1 text-xs text-yellow-600">
                      잠시 후 자동으로 업데이트됩니다
                    </p>
                  </div>
                )}

                {meeting.status === "completed" && (
                  <MeetingMinutesViewer meetingId={meetingId} />
                )}

                {meeting.status === "failed" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                    <p className="text-sm font-medium text-red-800">
                      회의록 생성에 실패했습니다
                    </p>
                    <p className="mt-1 text-xs text-red-600">
                      다시 시도하거나 관리자에게 문의하세요
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="py-16 text-center text-sm text-gray-400">
                회의를 찾을 수 없습니다
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
