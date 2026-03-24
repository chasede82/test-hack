"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/model/useAuth";
import Button from "@/shared/ui/Button";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            M
          </div>
          <span className="text-lg font-bold text-gray-900">MeetSync</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            대시보드
          </Link>
          <Link
            href="/channels"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            채널
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
                {user.name.charAt(0)}
              </div>
              <span className="hidden text-sm font-medium text-gray-700 md:block">
                {user.name}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout}>
              로그아웃
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
