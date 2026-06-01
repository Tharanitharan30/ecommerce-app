import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
  user:  JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,

  login: (user, token) => {
    localStorage.setItem('user',  JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  refreshUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { data } = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, token });
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set((state) => ({ ...state, user }));
  },
}));

export default useAuthStore;
