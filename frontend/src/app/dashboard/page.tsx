"use client";

import { useEffect, useState } from "react";
import Header from "@/widgets/header/ui/Header";
import Sidebar from "@/widgets/sidebar/ui/Sidebar";
import TodoDashboard from "@/widgets/todo-dashboard/ui/TodoDashboard";
import MeetingCard from "@/entities/meeting/ui/MeetingCard";
import { Meeting } from "@/entities/meeting/model/types";
import { getMeetings } from "@/entities/meeting/api/meetingApi";
import { useAuth } from "@/features/auth/model/useAuth";

export default function DashboardPage() {
  const [recentMeetings, setRecentMeetings] = useState<Meeting[]>([]);
  const [isLoadingMeetings, setIsLoadingMeetings] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await getMeetings();
        setRecentMeetings(data.slice(0, 5));
      } catch {
        // silently fail
      } finally {
        setIsLoadingMeetings(false);
      }
    };
    fetchMeetings();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                안녕하세요{user?.name ? `, ${user.name}님` : ""}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                오늘의 할 일과 최근 회의를 확인하세요.
              </p>
            </div>

            <TodoDashboard assigneeId={user?.id} />

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                최근 회의
              </h2>
              {isLoadingMeetings ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-20 animate-pulse rounded-xl bg-gray-100"
                    />
                  ))}
                </div>
              ) : recentMeetings.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  아직 회의 기록이 없습니다
                </p>
              ) : (
                <div className="space-y-3">
                  {recentMeetings.map((meeting) => (
                    <MeetingCard key={meeting.id} meeting={meeting} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
