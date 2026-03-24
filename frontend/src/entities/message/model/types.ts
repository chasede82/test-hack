export type MessageType = "text" | "meeting_minutes" | "system";

export interface MeetingCardData {
  title: string;
  summary: string;
  decisionCount: number;
  todoCount: number;
  status: "processing_stt" | "processing_ai" | "completed" | "failed";
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  content: string;
  type: MessageType;
  meetingId?: string;
  meetingCard?: MeetingCardData;
  createdAt: string;
}
