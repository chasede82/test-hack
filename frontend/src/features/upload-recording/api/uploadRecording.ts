import { apiInstance } from "@/shared/api/instance";

export interface UploadResult {
  id: number;
  meetingId: number;
  summary: string;
  discussions: string;
  decisions: string;
  transcript: string;
  todos: Array<{
    id: number;
    content: string;
    assigneeName: string;
    meetingTitle: string;
    dueDate: string;
    completed: boolean;
  }>;
}

export async function uploadRecording(
  channelId: string,
  title: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const { data } = await apiInstance.post<UploadResult>(
    `/channels/${channelId}/meetings/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 600000,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percent);
        }
      },
    }
  );

  return data;
}
