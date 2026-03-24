export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  assigneeId: string;
  assigneeName: string;
  meetingId: string;
  meetingTitle: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}
