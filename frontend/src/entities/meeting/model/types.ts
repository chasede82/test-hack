export interface Meeting {
  id: string;
  title: string;
  channelId: string;
  recordingUrl?: string;
  duration?: number;
  status: "uploading" | "processing" | "completed" | "failed";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface ActionItem {
  id: string;
  content: string;
  assigneeId: string;
  assigneeName: string;
  deadline?: string;
  completed: boolean;
}

export interface MeetingMinutes {
  id: string;
  meetingId: string;
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  transcript?: string;
  participants: string[];
  generatedAt: string;
}
