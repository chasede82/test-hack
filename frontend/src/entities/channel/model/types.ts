export interface Channel {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  lastMessageAt?: string;
}
