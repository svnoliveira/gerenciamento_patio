import { create } from "zustand";
import { IUserState } from "../interface/user/user";

export const useUserStore = create<IUserState>()((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
