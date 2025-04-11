import { create } from "zustand";

interface CallStore {
  username: string;
  setUserName: (name: string) => void;
}

export const useCallStore = create<CallStore>((set) => ({
  username: "",
  setUserName: (name) => set({ username: name }),
}));
