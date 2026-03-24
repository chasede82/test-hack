"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/widgets/header/ui/Header";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";
import MeetingMinutesViewer from "@/widgets/meeting-minutes-viewer/ui/MeetingMinutesViewer";
import TodoDashboard from "@/widgets/todo-dashboard/ui/TodoDashboard";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import { Meeting } from "@/entities/meeting/model/types";
import { getMeeting } from "@/entities/meeting/api/meetingApi";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.meetingId as string;
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const data = await getMeeting(meetingId);
        setMeeting(data);
      } catch {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeeting();
  }, [meetingId]);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {/* 상단 성공 배너 */}
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-semibold text-green-800">AI 회의록 생성 완료!</h2>
                  <p className="text-sm text-green-600">
                    음성 파일 분석이 완료되어 회의록과 할 일 목록이 생성되었습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 회의 정보 */}
            {meeting && (
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{meeting.title}</h1>
                  <p className="mt-1 text-sm text-gray-500">
                    작성자: {meeting.createdByName}
                  </p>
                </div>
                <Badge label="완료" variant="success" />
              </div>
            )}

            {/* 회의록 */}
            <MeetingMinutesViewer meetingId={meetingId} />

            {/* 할 일 목록 */}
            <TodoDashboard />

            {/* 돌아가기 버튼 */}
            <div className="flex justify-center pb-6">
              <Button variant="secondary" onClick={() => router.push("/dashboard")}>
                대시보드로 돌아가기
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
