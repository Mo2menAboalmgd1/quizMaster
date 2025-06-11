import { create } from "zustand";

export const useSession = create((set) => ({
  session: null,
  isSessionLoading: true,

  getSession: (sessionData = null) => {
    set({
      session: sessionData,
      isSessionLoading: false,
    });
  },
}));

export const useCurrentUser = create((set) => ({
  currentUser: null,
  isCurrentUserLoading: true,

  getCurrentUser: (userData = null) => {
    set({
      currentUser: userData,
      isCurrentUserLoading: false,
    });
  },
}));

export const useDarkMode = create((set) => ({
  isDarkMode:
    localStorage.getItem("isDarkMode") &&
    localStorage.getItem("isDarkMode") === "true"
      ? true
      : false,
  getMode: (isDarkMode) => set({ isDarkMode }),
}));

export const useLanguage = create((set) => ({
  isArabic:
    localStorage.getItem("isArabic") &&
    localStorage.getItem("isArabic") === "true"
      ? true
      : false,
  getLanguage: (isArabic) => set({ isArabic }),
}));

export const publicStage = "00000000-0000-0000-0000-000000000000";
