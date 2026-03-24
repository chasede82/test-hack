"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/shared/ui/Modal";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { createChannel } from "@/entities/channel/api/channelApi";

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateChannelModal({
  isOpen,
  onClose,
}: CreateChannelModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError("");
    try {
      await createChannel({ name: name.trim(), description: description.trim() });
      handleClose();
      router.refresh();
    } catch {
      setError("채널 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="새 채널 만들기" size="sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="채널 이름"
          placeholder="채널 이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
          autoFocus
        />
        <Input
          label="설명 (선택)"
          placeholder="채널에 대한 설명을 입력하세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>
            취소
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={!name.trim()}>
            만들기
          </Button>
        </div>
      </form>
    </Modal>
  );
}
