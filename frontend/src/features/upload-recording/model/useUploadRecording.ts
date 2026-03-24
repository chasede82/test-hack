import { create } from "zustand";
import { uploadRecording, UploadResult } from "@/features/upload-recording/api/uploadRecording";

const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/x-m4a",
  "audio/x-wav",
  "audio/wave",
  "video/mp4",
];
const MAX_SIZE = 500 * 1024 * 1024;

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isModalOpen: boolean;
  result: UploadResult | null;
  openModal: () => void;
  closeModal: () => void;
  upload: (channelId: string, title: string, file: File) => Promise<UploadResult | null>;
  reset: () => void;
}

export const useUploadRecording = create<UploadState>((set) => ({
  isUploading: false,
  progress: 0,
  error: null,
  isModalOpen: false,
  result: null,

  openModal: () => set({ isModalOpen: true, error: null, progress: 0, result: null }),
  closeModal: () => set({ isModalOpen: false, error: null, progress: 0 }),

  upload: async (channelId, title, file) => {
    // More lenient type check - also check by extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowedExts = ['mp3', 'mp4', 'wav', 'm4a'];
    if (!ALLOWED_TYPES.includes(file.type) && (!ext || !allowedExts.includes(ext))) {
      set({ error: "지원하지 않는 파일 형식입니다. (mp3, mp4, wav, m4a)" });
      return null;
    }
    if (file.size > MAX_SIZE) {
      set({ error: "파일 크기는 500MB를 초과할 수 없습니다." });
      return null;
    }

    set({ isUploading: true, progress: 0, error: null });
    try {
      const result = await uploadRecording(channelId, title, file, (progress) => {
        set({ progress });
      });
      set({ isUploading: false, progress: 100, isModalOpen: false, result });
      return result;
    } catch (err: any) {
      const message = err?.response?.data?.message || "업로드에 실패했습니다. 다시 시도해주세요.";
      set({ isUploading: false, error: message });
      return null;
    }
  },

  reset: () => set({ isUploading: false, progress: 0, error: null, result: null }),
}));
