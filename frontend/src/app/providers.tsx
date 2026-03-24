"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/features/auth/model/useAuth";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const { fetchMe } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchMe();
    }
  }, [fetchMe]);

  return <>{children}</>;
}
