import { apiInstance } from "@/shared/api/instance";
import { Todo } from "@/entities/todo/model/types";

export async function getTodos(assigneeId?: string): Promise<Todo[]> {
  const params = assigneeId ? { assigneeId } : {};
  const { data } = await apiInstance.get<Todo[]>("/todos", { params });
  return data;
}

export async function updateTodo(
  todoId: string,
  payload: Partial<Pick<Todo, "completed" | "deadline" | "content">>
): Promise<Todo> {
  const { data } = await apiInstance.patch<Todo>(`/todos/${todoId}`, payload);
  return data;
}

export async function deleteTodo(todoId: string): Promise<void> {
  await apiInstance.delete(`/todos/${todoId}`);
}
