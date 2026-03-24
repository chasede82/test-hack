import { apiInstance } from "@/shared/api/instance";
import { Todo } from "@/entities/todo/model/types";

export async function getTodos(): Promise<Todo[]> {
  const { data } = await apiInstance.get<Todo[]>("/todos");
  return data;
}

export async function updateTodo(
  todoId: string,
  payload: Partial<Pick<Todo, "completed" | "dueDate" | "content">>
): Promise<Todo> {
  const { data } = await apiInstance.put<Todo>(`/todos/${todoId}`, payload);
  return data;
}

export async function deleteTodo(todoId: string): Promise<void> {
  await apiInstance.delete(`/todos/${todoId}`);
}
