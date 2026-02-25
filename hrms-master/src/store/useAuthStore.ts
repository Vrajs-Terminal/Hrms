import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    username: string | null;
    login: (username: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: localStorage.getItem('auth_user') !== null,
    username: localStorage.getItem('auth_user'),
    login: (username) => {
        localStorage.setItem('auth_user', username);
        set({ isAuthenticated: true, username });
    },
    logout: () => {
        localStorage.removeItem('auth_user');
        set({ isAuthenticated: false, username: null });
    },
}));
