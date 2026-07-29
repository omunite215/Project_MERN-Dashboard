import { create } from "zustand";
import { persist } from "zustand/middleware";

type Mode = "light" | "dark";

interface ThemeState {
  mode: Mode;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: "dark",
      toggleMode: () => set((s) => ({ mode: s.mode === "light" ? "dark" : "light" })),
    }),
    { name: "theme-mode" }
  )
);
