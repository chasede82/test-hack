export interface Message {
  id: number;
  content: string;
  senderId: number;
  senderName: string;
  messageType: "TEXT" | "MEETING_MINUTES" | "SYSTEM";
  createdAt: string;
}
