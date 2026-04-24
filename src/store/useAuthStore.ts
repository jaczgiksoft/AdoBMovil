import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PatientUser, PatientProfile } from '../modules/auth/types';

interface AuthState {
  user: PatientUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  availableProfiles: PatientProfile[];

  login: (user: PatientUser, token: string, profiles?: PatientProfile[]) => void;
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
      availableProfiles: [],

      login: (user, token, profiles = []) =>
        set({
          user,
          token,
          isAuthenticated: true,
          availableProfiles: profiles,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          availableProfiles: [],
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