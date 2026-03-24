"use client";

import { useState } from "react";
import { Todo } from "@/entities/todo/model/types";
import { useTodoActions } from "@/features/manage-todo/model/useTodoActions";
import Badge from "@/shared/ui/Badge";
import { formatDate } from "@/shared/lib/formatDate";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const { toggleComplete, updateDeadline, deleteTodo } = useTodoActions();
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [deadlineValue, setDeadlineValue] = useState(
    todo.deadline?.split("T")[0] || ""
  );

  const isOverdue =
    todo.deadline && !todo.completed && new Date(todo.deadline) < new Date();

  const handleDeadlineSave = () => {
    if (deadlineValue) {
      updateDeadline(todo.id, new Date(deadlineValue).toISOString());
    }
    setIsEditingDeadline(false);
  };

  return (
    <div
      className={`group rounded-lg border p-3 transition-all ${
        todo.completed
          ? "border-gray-100 bg-gray-50"
          : "border-gray-200 bg-white hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => toggleComplete(todo.id, !todo.completed)}
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
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500">{todo.assigneeName}</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-500">{todo.meetingTitle}</span>
            {isEditingDeadline ? (
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={deadlineValue}
                  onChange={(e) => setDeadlineValue(e.target.value)}
                  className="rounded border border-gray-300 px-1.5 py-0.5 text-xs"
                />
                <button
                  onClick={handleDeadlineSave}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  저장
                </button>
              </div>
            ) : (
              todo.deadline && (
                <button
                  onClick={() => setIsEditingDeadline(true)}
                  className="hover:underline"
                >
                  <Badge
                    label={formatDate(todo.deadline)}
                    variant={isOverdue ? "error" : "default"}
                  />
                </button>
              )
            )}
          </div>
        </div>

        <button
          onClick={() => deleteTodo(todo.id)}
          className="rounded p-1 text-gray-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
