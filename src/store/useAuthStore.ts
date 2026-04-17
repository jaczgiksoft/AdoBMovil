import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PatientUser } from '../modules/auth/types';

interface AuthState {
  user: PatientUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (user: PatientUser, token: string) => void;
  logout: () => void;
  completeFirstAccess: () => void;

  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      completeFirstAccess: () =>
        set((state) => ({
          user: state.user
            ? { ...state.user, isFirstAccess: false }
            : null,
        })),

      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: 'bwise-auth-storage',

      // 🔥 CLAVE: detectar cuando ya cargó el storage
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);