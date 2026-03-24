"use client";

import Link from "next/link";
import { MeetingCardData } from "@/entities/message/model/types";

interface MeetingCardMessageProps {
  meetingId: string;
  data: MeetingCardData;
}

export default function MeetingCardMessage({
  meetingId,
  data,
}: MeetingCardMessageProps) {
  if (data.status === "processing_stt") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="animate-pulse text-sm text-gray-500">
          🎙️ 음성을 텍스트로 변환하는 중입니다...
        </p>
      </div>
    );
  }

  if (data.status === "processing_ai") {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="animate-pulse text-sm text-gray-500">
          🤖 AI가 회의록을 작성하는 중입니다...
        </p>
      </div>
    );
  }

  if (data.status === "failed") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
        <p className="text-sm text-red-600">⚠️ 회의록 생성에 실패했습니다.</p>
      </div>
    );
  }

  // completed
  return (
    <div className="w-72 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-2.5">
        <p className="text-xs font-semibold text-gray-500">🤖 MeetSync AI</p>
      </div>
      <div className="px-4 py-3">
        <p className="mb-2 text-sm font-semibold text-gray-900">
          📄 {data.title}
        </p>
        <hr className="mb-2 border-gray-100" />
        <p className="mb-0.5 text-xs font-medium text-gray-500">📝 요약</p>
        <p className="mb-2 line-clamp-2 text-sm text-gray-700">
          {data.summary}
        </p>
        <hr className="mb-2 border-gray-100" />
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            ✅ 결정 사항{" "}
            <span className="font-medium text-gray-700">
              {data.decisionCount}건
            </span>
            {"  "}
            👥 할 일{" "}
            <span className="font-medium text-gray-700">
              {data.todoCount}건
            </span>
          </p>
          <Link
            href={`/meetings/${meetingId}`}
            className="text-xs font-medium text-blue-600 hover:text-blue-800"
          >
            회의록 보기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
