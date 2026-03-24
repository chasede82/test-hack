import { apiInstance } from "@/shared/api/instance";
import { Channel } from "@/entities/channel/model/types";

export async function getChannels(): Promise<Channel[]> {
  const { data } = await apiInstance.get<Channel[]>("/channels");
  return data;
}

export async function getChannel(channelId: string): Promise<Channel> {
  const { data } = await apiInstance.get<Channel>(`/channels/${channelId}`);
  return data;
}

export async function createChannel(
  payload: Pick<Channel, "name" | "description">
): Promise<Channel> {
  const { data } = await apiInstance.post<Channel>("/channels", payload);
  return data;
}

export async function deleteChannel(channelId: string): Promise<void> {
  await apiInstance.delete(`/channels/${channelId}`);
}
