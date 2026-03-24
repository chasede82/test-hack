import { create } from "zustand";
import { Todo } from "@/entities/todo/model/types";
import {
  getTodos,
  updateTodo,
  deleteTodo as deleteTodoApi,
} from "@/entities/todo/api/todoApi";

interface TodoActionsState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  fetchTodos: (assigneeId?: string) => Promise<void>;
  toggleComplete: (todoId: string, completed: boolean) => Promise<void>;
  updateDeadline: (todoId: string, deadline: string) => Promise<void>;
  deleteTodo: (todoId: string) => Promise<void>;
}

export const useTodoActions = create<TodoActionsState>((set, get) => ({
  todos: [],
  isLoading: false,
  error: null,

  fetchTodos: async (assigneeId) => {
    set({ isLoading: true, error: null });
    try {
      const todos = await getTodos(assigneeId);
      set({ todos, isLoading: false });
    } catch {
      set({ error: "할 일 목록을 불러오지 못했습니다.", isLoading: false });
    }
  },

  toggleComplete: async (todoId, completed) => {
    const prev = get().todos;
    set({
      todos: prev.map((t) => (t.id === todoId ? { ...t, completed } : t)),
    });
    try {
      await updateTodo(todoId, { completed });
    } catch {
      set({ todos: prev, error: "상태 변경에 실패했습니다." });
    }
  },

  updateDeadline: async (todoId, deadline) => {
    try {
      const updated = await updateTodo(todoId, { deadline });
      set({
        todos: get().todos.map((t) => (t.id === todoId ? updated : t)),
      });
    } catch {
      set({ error: "마감일 변경에 실패했습니다." });
    }
  },

  deleteTodo: async (todoId) => {
    const prev = get().todos;
    set({ todos: prev.filter((t) => t.id !== todoId) });
    try {
      await deleteTodoApi(todoId);
    } catch {
      set({ todos: prev, error: "삭제에 실패했습니다." });
    }
  },
}));
