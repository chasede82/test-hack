export interface Todo {
  id: number;
  content: string;
  completed: boolean;
  assigneeName: string;
  meetingTitle: string;
  dueDate: string | null;
}
