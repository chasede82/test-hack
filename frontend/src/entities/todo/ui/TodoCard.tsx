"use client";

import { Todo } from "@/entities/todo/model/types";
import Badge from "@/shared/ui/Badge";
import { formatDate } from "@/shared/lib/formatDate";

interface TodoCardProps {
  todo: Todo;
  onToggle?: (id: string, completed: boolean) => void;
}

export default function TodoCard({ todo, onToggle }: TodoCardProps) {
  const isOverdue =
    todo.deadline && !todo.completed && new Date(todo.deadline) < new Date();

  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        todo.completed
          ? "border-gray-100 bg-gray-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle?.(todo.id, !todo.completed)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
            todo.completed
              ? "border-green-500 bg-green-500 text-white"
              : "border-gray-300 hover:border-blue-500"
          }`}
        >
          {todo.completed && (
            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm ${
              todo.completed ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {todo.content}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-500">{todo.assigneeName}</span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs text-gray-500">{todo.meetingTitle}</span>
            {todo.deadline && (
              <>
                <span className="text-xs text-gray-300">|</span>
                <Badge
                  label={formatDate(todo.deadline)}
                  variant={isOverdue ? "error" : "default"}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
