import { create } from "zustand";
import { uploadRecording } from "@/features/upload-recording/api/uploadRecording";

const ALLOWED_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/wav",
  "audio/x-m4a",
  "video/mp4",
];
const MAX_SIZE = 500 * 1024 * 1024; // 500MB

interface UploadState {
  isUploading: boolean;
  progress: number;
  error: string | null;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  upload: (channelId: string, title: string, file: File) => Promise<void>;
  reset: () => void;
}

export const useUploadRecording = create<UploadState>((set) => ({
  isUploading: false,
  progress: 0,
  error: null,
  isModalOpen: false,

  openModal: () => set({ isModalOpen: true, error: null, progress: 0 }),
  closeModal: () => set({ isModalOpen: false, error: null, progress: 0 }),

  upload: async (channelId, title, file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      set({ error: "지원하지 않는 파일 형식입니다. (mp3, mp4, wav, m4a)" });
      return;
    }
    if (file.size > MAX_SIZE) {
      set({ error: "파일 크기는 500MB를 초과할 수 없습니다." });
      return;
    }

    set({ isUploading: true, progress: 0, error: null });
    try {
      await uploadRecording(channelId, title, file, (progress) => {
        set({ progress });
      });
      set({ isUploading: false, progress: 100, isModalOpen: false });
    } catch {
      set({ isUploading: false, error: "업로드에 실패했습니다. 다시 시도해주세요." });
    }
  },

  reset: () => set({ isUploading: false, progress: 0, error: null }),
}));
