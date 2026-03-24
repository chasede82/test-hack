import { apiInstance } from "@/shared/api/instance";
import { Meeting } from "@/entities/meeting/model/types";

export async function uploadRecording(
  channelId: string,
  title: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<Meeting> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("channelId", channelId);
  formData.append("title", title);

  const { data } = await apiInstance.post<Meeting>("/meetings/upload", formData, {
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
  });

  return data;
}
