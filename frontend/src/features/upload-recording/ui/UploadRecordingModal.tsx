"use client";

import { useState, useRef, DragEvent } from "react";
import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import ProgressBar from "@/shared/ui/ProgressBar";
import { useUploadRecording } from "@/features/upload-recording/model/useUploadRecording";

interface UploadRecordingModalProps {
  channelId: string;
}

export default function UploadRecordingModal({ channelId }: UploadRecordingModalProps) {
  const { isModalOpen, closeModal, upload, isUploading, progress, error } =
    useUploadRecording();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleSubmit = async () => {
    if (!file || !title.trim()) return;
    await upload(channelId, title, file);
    setTitle("");
    setFile(null);
  };

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title="녹음 파일 업로드">
      <div className="space-y-4">
        <Input
          label="회의 제목"
          placeholder="회의 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            녹음 파일
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <svg
              className="mb-3 h-10 w-10 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            {file ? (
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-700">
                  파일을 드래그하거나 클릭하여 선택하세요
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  MP3, MP4, WAV, M4A (최대 500MB)
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.mp4,.wav,.m4a"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) setFile(selected);
            }}
          />
        </div>

        {isUploading && (
          <ProgressBar progress={progress} label="업로드 진행률" />
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={closeModal} disabled={isUploading}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isUploading}
            disabled={!file || !title.trim()}
          >
            업로드
          </Button>
        </div>
      </div>
    </Modal>
  );
}
