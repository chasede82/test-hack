"use client";

import { useEffect } from "react";
import { useTodoActions } from "@/features/manage-todo/model/useTodoActions";
import TodoItem from "@/features/manage-todo/ui/TodoItem";

interface TodoDashboardProps {
  assigneeId?: string;
}

export default function TodoDashboard({ assigneeId }: TodoDashboardProps) {
  const { todos, isLoading, error, fetchTodos } = useTodoActions();

  useEffect(() => {
    fetchTodos(assigneeId);
  }, [assigneeId, fetchTodos]);

  const pendingTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">나의 할 일</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>총 {todos.length}개</span>
          <span className="text-gray-300">|</span>
          <span className="text-green-600">{completedTodos.length}개 완료</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : error ? (
        <p className="py-8 text-center text-sm text-red-600">{error}</p>
      ) : todos.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-400">
          할 일이 없습니다
        </p>
      ) : (
        <div className="space-y-4">
          {pendingTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                진행 중 ({pendingTodos.length})
              </h3>
              {pendingTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}

          {completedTodos.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-wider text-gray-400">
                완료됨 ({completedTodos.length})
              </h3>
              {completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
