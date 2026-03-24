"use client";

import { useEffect, useState } from "react";
import { MeetingMinutes } from "@/entities/meeting/model/types";
import { getMeetingMinutes } from "@/entities/meeting/api/meetingApi";
import Badge from "@/shared/ui/Badge";

interface MeetingMinutesViewerProps {
  meetingId: string;
}

interface DiscussionItem {
  topic: string;
  detail: string;
}

interface DecisionItem {
  decision: string;
}

function parseJsonSafe<T>(jsonStr: string, fallback: T): T {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return fallback;
  }
}

export default function MeetingMinutesViewer({
  meetingId,
}: MeetingMinutesViewerProps) {
  const [minutes, setMinutes] = useState<MeetingMinutes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMeetingMinutes(meetingId);
        setMinutes(data);
      } catch {
        setError("회의록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [meetingId]);

  if (isLoading) {
    return (
      <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    );
  }

  if (error || !minutes) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="text-center text-sm text-red-600">
          {error || "회의록이 없습니다."}
        </p>
      </div>
    );
  }

  const discussions = parseJsonSafe<DiscussionItem[]>(minutes.discussions, []);
  const decisions = parseJsonSafe<DecisionItem[]>(minutes.decisions, []);

  return (
    <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6">
      <div>
        <div className="mb-1 flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">AI 회의록</h2>
          <Badge label="AI 생성" variant="info" />
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700">요약</h3>
        <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
          {minutes.summary}
        </p>
      </div>

      {discussions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            논의 사항
          </h3>
          <div className="space-y-3">
            {discussions.map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <p className="text-sm font-medium text-gray-800">{item.topic}</p>
                <p className="mt-1 text-sm text-gray-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {decisions.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            주요 결정사항
          </h3>
          <ul className="space-y-1.5">
            {decisions.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-gray-600"
              >
                <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-medium text-blue-700">
                  {i + 1}
                </span>
                {item.decision}
              </li>
            ))}
          </ul>
        </div>
      )}

      {minutes.todos && minutes.todos.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-semibold text-gray-700">
            할 일 목록
          </h3>
          <div className="space-y-2">
            {minutes.todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3"
              >
                <div
                  className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                    todo.completed
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{todo.content}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span>담당: {todo.assigneeName}</span>
                    {todo.dueDate && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>마감: {todo.dueDate}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {minutes.transcript && (
        <details className="group">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600">
            전체 트랜스크립트 보기
          </summary>
          <div className="mt-3 max-h-96 overflow-y-auto rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
            {minutes.transcript}
          </div>
        </details>
      )}
    </div>
  );
}
