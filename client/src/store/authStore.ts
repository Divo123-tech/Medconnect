import { Doctor, Patient } from "@/utils/types";
import { create } from "zustand";

interface AuthStore {
  user: null | Patient | Doctor;
  setUser: (user: Patient | Doctor) => void;

  token: null | string;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: Patient | Doctor) => set({ user }),

  token: null,
  setToken: (token: string) => set({ token }),
}));
