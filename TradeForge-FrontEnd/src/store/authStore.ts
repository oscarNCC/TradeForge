import { create } from 'zustand';
import type { User } from '../types/auth';
import * as authService from '../services/authService';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: authService.getToken(),
  isLoading: false,
  isInitialized: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.login({ email, password });
      set({ user, token, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error('Login failed');
    }
  },

  register: async (email: string, password: string, username?: string) => {
    set({ isLoading: true });
    try {
      const { user, token } = await authService.register({ email, password, username });
      set({ user, token, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error('Registration failed');
    }
  },

  logout: () => {
    authService.removeToken();
    set({ user: null, token: null });
  },

  setUser: (user) => set({ user }),

  restoreSession: async () => {
    const token = authService.getToken();
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    try {
      const user = await authService.getCurrentUser();
      set({ user, token, isInitialized: true });
    } catch {
      authService.removeToken();
      set({ user: null, token: null, isInitialized: true });
    }
  },
}));
