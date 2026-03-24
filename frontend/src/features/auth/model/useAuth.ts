import { create } from "zustand";
import { User } from "@/entities/user/model/types";
import { login as loginApi, getMe } from "@/entities/user/api/userApi";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken, user } = await loginApi(email, password);
      localStorage.setItem("access_token", accessToken);
      set({ user, isLoading: false });
    } catch {
      set({ error: "로그인에 실패했습니다.", isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    set({ user: null });
    window.location.href = "/login";
  },

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const user = await getMe();
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
}));
