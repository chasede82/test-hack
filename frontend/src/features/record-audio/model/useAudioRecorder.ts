import { create } from "zustand";

interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  error: string | null;
  mediaRecorder: MediaRecorder | null;
  intervalId: ReturnType<typeof setInterval> | null;
  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  reset: () => void;
}

export const useAudioRecorder = create<AudioRecorderState>((set, get) => ({
  isRecording: false,
  isPaused: false,
  duration: 0,
  audioBlob: null,
  error: null,
  mediaRecorder: null,
  intervalId: null,

  startRecording: async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        set({ audioBlob: blob, isRecording: false, isPaused: false });
        stream.getTracks().forEach((track) => track.stop());
        const { intervalId } = get();
        if (intervalId) clearInterval(intervalId);
      };

      mediaRecorder.start(1000);

      const intervalId = setInterval(() => {
        set((state) => ({ duration: state.duration + 1 }));
      }, 1000);

      set({
        mediaRecorder,
        isRecording: true,
        isPaused: false,
        duration: 0,
        audioBlob: null,
        error: null,
        intervalId,
      });
    } catch {
      set({ error: "마이크 접근 권한이 필요합니다." });
    }
  },

  pauseRecording: () => {
    const { mediaRecorder, intervalId } = get();
    if (mediaRecorder?.state === "recording") {
      mediaRecorder.pause();
      if (intervalId) clearInterval(intervalId);
      set({ isPaused: true, intervalId: null });
    }
  },

  resumeRecording: () => {
    const { mediaRecorder } = get();
    if (mediaRecorder?.state === "paused") {
      mediaRecorder.resume();
      const intervalId = setInterval(() => {
        set((state) => ({ duration: state.duration + 1 }));
      }, 1000);
      set({ isPaused: false, intervalId });
    }
  },

  stopRecording: () => {
    const { mediaRecorder } = get();
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  },

  reset: () => {
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({
      isRecording: false,
      isPaused: false,
      duration: 0,
      audioBlob: null,
      error: null,
      mediaRecorder: null,
      intervalId: null,
    });
  },
}));
