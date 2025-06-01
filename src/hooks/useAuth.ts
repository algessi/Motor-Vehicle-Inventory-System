import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
    role: 'admin' | 'user';
  };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // TODO: Implement actual login logic
    set({ isAuthenticated: true, user: { id: '1', email, role: 'user' } });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));