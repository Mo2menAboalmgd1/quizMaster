import { create } from "zustand";

export const useSession = create((set) => ({
  session: null,
  getSession: (session) => set({ session: session }),
}));

export const useCurrentUser = create((set) => ({
  currentUser: null,
  getCurrentUser: (data) => set({ currentUser: data }),
}));