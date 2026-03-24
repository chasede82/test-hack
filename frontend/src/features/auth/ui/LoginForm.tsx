"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/model/useAuth";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await login(email, password);
    if (!useAuth.getState().error) {
      router.push("/dashboard");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <Input
        label="이메일"
        type="email"
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="비밀번호"
        type="password"
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <Button type="submit" isLoading={isLoading} className="w-full">
        로그인
      </Button>
    </form>
  );
}
