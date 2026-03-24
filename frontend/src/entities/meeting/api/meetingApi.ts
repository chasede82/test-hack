import { apiInstance } from "@/shared/api/instance";
import { Meeting, MeetingMinutes } from "@/entities/meeting/model/types";

export async function getMeetings(channelId?: string): Promise<Meeting[]> {
  const params = channelId ? { channelId } : {};
  const { data } = await apiInstance.get<Meeting[]>("/meetings", { params });
  return data;
}

export async function getMeeting(meetingId: string): Promise<Meeting> {
  const { data } = await apiInstance.get<Meeting>(`/meetings/${meetingId}`);
  return data;
}

export async function getMeetingMinutes(meetingId: string): Promise<MeetingMinutes> {
  const { data } = await apiInstance.get<MeetingMinutes>(
    `/meetings/${meetingId}/minutes`
  );
  return data;
}

export async function deleteMeeting(meetingId: string): Promise<void> {
  await apiInstance.delete(`/meetings/${meetingId}`);
}
