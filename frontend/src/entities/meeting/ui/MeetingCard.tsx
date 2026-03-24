"use client";

import { Meeting } from "@/entities/meeting/model/types";
import Badge from "@/shared/ui/Badge";
import { formatDateTime } from "@/shared/lib/formatDate";
import { formatDuration } from "@/shared/lib/formatDuration";
import Link from "next/link";

interface MeetingCardProps {
  meeting: Meeting;
}

const statusMap: Record<Meeting["status"], { label: string; variant: "default" | "success" | "warning" | "error" | "info" }> = {
  uploading: { label: "업로드 중", variant: "info" },
  processing: { label: "분석 중", variant: "warning" },
  completed: { label: "완료", variant: "success" },
  failed: { label: "실패", variant: "error" },
};

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const status = statusMap[meeting.status];

  return (
    <Link href={`/meetings/${meeting.id}`}>
      <div className="group rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {meeting.title}
          </h3>
          <Badge label={status.label} variant={status.variant} />
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{formatDateTime(meeting.createdAt)}</span>
          {meeting.duration && (
            <>
              <span className="text-gray-300">|</span>
              <span>{formatDuration(meeting.duration)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
