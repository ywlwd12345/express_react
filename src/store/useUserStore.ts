// src/store/useUserStore.ts
import { create } from 'zustand';

interface UserState {
  token: string | null;
  roles: string[]; // 例如: ['admin']
  setLogin: (token: string, roles: string[]) => void;
  logout: () => void;
}


export const useUserStore = create<UserState>((set) => ({
  token: localStorage.getItem('token'),
  roles: JSON.parse(localStorage.getItem('roles') || '[]'),
  setLogin: (token, roles) => {
    localStorage.setItem('token', token);
    localStorage.setItem('roles', JSON.stringify(roles));
    set({ token, roles });
  },
  logout: () => {
    localStorage.clear();
    set({ token: null, roles: [] });
  },

}));