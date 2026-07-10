import { create } from 'zustand';
import { User } from '../services/authService';
import { getItem, setItem, removeItem, storageKeys } from '../utils/storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const accessToken = getItem<string>(storageKeys.auth.accessToken);
  const persistedUser = accessToken ? getItem<User>(storageKeys.auth.user) : null;

  setTimeout(() => {
    set({ isLoading: false });
  }, 800);

  return {
    user: persistedUser,
    isAuthenticated: persistedUser !== null,
    isLoading: true,
    login: (user) => {
      setItem(storageKeys.auth.user, user);
      set({ user, isAuthenticated: true, isLoading: false });
    },
    logout: () => {
      removeItem(storageKeys.auth.user);
      set({ user: null, isAuthenticated: false, isLoading: false });
    },
    setLoading: (loading) => set({ isLoading: loading }),
  };
});