import { Doctor, Patient } from "@/utils/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  user: null | Patient | Doctor;
  setUser: (user: Patient | Doctor | null) => void;

  token: null | string;
  setToken: (token: string | null) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      token: null,
      setToken: (token) => set({ token }),

      logout: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token }), // only persist user and token
    }
  )
);
