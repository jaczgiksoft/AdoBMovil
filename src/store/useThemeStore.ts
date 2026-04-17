import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => set((state) => {
        const newDark = !state.isDarkMode;
        if (newDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { isDarkMode: newDark };
      }),
      setTheme: (isDark) => set(() => {
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { isDarkMode: isDark };
      }),
    }),
    {
      name: 'bwise-theme-storage',
      onRehydrateStorage: () => (state) => {
        // Automatically applied once rehydrated
        if (state) {
           if (state.isDarkMode) document.documentElement.classList.add('dark');
           else document.documentElement.classList.remove('dark');
        }
      }
    }
  )
);
