import { apiInstance } from "@/shared/api/instance";
import { Meeting, MeetingMinutes } from "@/entities/meeting/model/types";

export async function getMeetings(channelId?: string): Promise<Meeting[]> {
  if (channelId) {
    const { data } = await apiInstance.get<Meeting[]>(`/channels/${channelId}/meetings`);
    return data;
  }
  // If no channelId, return empty (BE doesn't have a global meetings endpoint)
  return [];
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

export async function processMeeting(meetingId: string): Promise<MeetingMinutes> {
  const { data } = await apiInstance.post<MeetingMinutes>(
    `/meetings/${meetingId}/process`
  );
  return data;
}

export function getRecordingDownloadUrl(meetingId: string | number): string {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  return `${apiInstance.defaults.baseURL}/meetings/${meetingId}/download?token=${token}`;
}

export async function downloadRecording(meetingId: string | number, filename?: string): Promise<void> {
  const { data } = await apiInstance.get(`/meetings/${meetingId}/download`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "recording";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
