import { create } from "zustand";

export const useSession = create((set) => ({
  session: null,
  getSession: (session) => set({ session: session }),
}));

export const useCurrentUser = create((set) => ({
  currentUser: null,
  getCurrentUser: (data) => set({ currentUser: data }),
}));

export const useDarkMode = create((set) => ({
  isDarkMode: true,
  getMode: (isDarkMode) => set({ isDarkMode }),
}));

export const publicStage = "00000000-0000-0000-0000-000000000000";
