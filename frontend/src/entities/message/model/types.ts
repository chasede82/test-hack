export type MessageType = "text" | "meeting_minutes";

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  content: string;
  type: MessageType;
  meetingId?: string;
  createdAt: string;
}
