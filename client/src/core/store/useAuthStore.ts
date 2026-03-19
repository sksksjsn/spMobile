/**
 * Auth Store
 *
 * 인증 상태 관리 (Zustand + localStorage 지속성)
 *
 * @example
 * const { user, login, logout, isAuthenticated } = useAuthStore();
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/domains/auth/api';
import type { AuthUser } from '@/domains/auth/types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (loginId: string, password: string) => {
        const data = await authApi.login({ loginId, password });
        set({ user: data.user, token: data.accessToken, isAuthenticated: true });
      },

      logout: async () => {
        try {
          if (get().isAuthenticated) {
            await authApi.logout();
          }
        } finally {
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      setUser: (user: AuthUser) => {
        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        // 토큰 만료 여부 확인: 만료된 경우 인증 상태 초기화
        if (state?.token) {
          try {
            const payload = JSON.parse(atob(state.token.split('.')[1]));
            if (payload.exp * 1000 < Date.now()) {
              state.isAuthenticated = false;
              state.user = null;
              state.token = null;
            }
          } catch {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
          }
        }
      },
    }
  )
);
