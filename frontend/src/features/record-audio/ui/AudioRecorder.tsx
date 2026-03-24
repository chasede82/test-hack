"use client";

import { useAudioRecorder } from "@/features/record-audio/model/useAudioRecorder";
import { formatDurationShort } from "@/shared/lib/formatDuration";
import Button from "@/shared/ui/Button";

interface AudioRecorderProps {
  onRecordingComplete?: (blob: Blob) => void;
}

export default function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset,
  } = useAudioRecorder();

  const handleStop = () => {
    stopRecording();
    setTimeout(() => {
      const blob = useAudioRecorder.getState().audioBlob;
      if (blob && onRecordingComplete) {
        onRecordingComplete(blob);
      }
    }, 200);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-3">
        {isRecording && (
          <span className="relative flex h-3 w-3">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isPaused ? "bg-yellow-400" : "bg-red-400 animate-ping"
              }`}
            />
            <span
              className={`relative inline-flex h-3 w-3 rounded-full ${
                isPaused ? "bg-yellow-500" : "bg-red-500"
              }`}
            />
          </span>
        )}
        <span className="font-mono text-2xl font-semibold text-gray-900">
          {formatDurationShort(duration)}
        </span>
        {isPaused && (
          <span className="text-sm text-yellow-600 font-medium">일시정지</span>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-2">
        {!isRecording && !audioBlob && (
          <Button onClick={startRecording}>
            <svg className="mr-1.5 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 4a3 3 0 016 0v6a3 3 0 01-6 0V4z" />
              <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
            </svg>
            녹음 시작
          </Button>
        )}

        {isRecording && !isPaused && (
          <>
            <Button variant="secondary" onClick={pauseRecording}>
              일시정지
            </Button>
            <Button variant="danger" onClick={handleStop}>
              녹음 종료
            </Button>
          </>
        )}

        {isRecording && isPaused && (
          <>
            <Button onClick={resumeRecording}>계속 녹음</Button>
            <Button variant="danger" onClick={handleStop}>
              녹음 종료
            </Button>
          </>
        )}

        {audioBlob && !isRecording && (
          <div className="flex flex-col gap-3 w-full">
            <audio
              src={URL.createObjectURL(audioBlob)}
              controls
              className="h-10 w-full"
            />
            <div className="flex items-center gap-2">
              <Button
                onClick={() => {
                  if (onRecordingComplete) onRecordingComplete(audioBlob);
                }}
              >
                업로드
              </Button>
              <Button variant="ghost" onClick={reset} size="sm">
                다시 녹음
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
