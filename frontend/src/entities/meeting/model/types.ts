export interface Meeting {
  id: number;
  title: string;
  channelId: number;
  recordingUrl?: string;
  duration?: number;
  status: "UPLOADING" | "PROCESSING" | "COMPLETED" | "FAILED";
  createdAt: string;
  createdByName: string;
}

export interface TodoItem {
  id: number;
  content: string;
  assigneeName: string;
  meetingTitle: string;
  dueDate: string | null;
  completed: boolean;
}

export interface MeetingMinutes {
  id: number;
  meetingId: number;
  summary: string;
  discussions: string; // JSON string
  decisions: string;   // JSON string
  transcript?: string;
  todos: TodoItem[];
}
