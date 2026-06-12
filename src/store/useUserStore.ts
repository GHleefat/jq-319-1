import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { mockUsers, getDefaultUser } from "@/utils/mockData";

interface UserState {
  users: User[];
  currentUserId: string;

  setCurrentUser: (userId: string) => void;
  getCurrentUser: () => User | undefined;
  getUserById: (userId: string) => User | undefined;
  addUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: mockUsers,
      currentUserId: getDefaultUser().id,

      setCurrentUser: (userId) => {
        set({ currentUserId: userId });
      },

      getCurrentUser: () => {
        return get().users.find((u) => u.id === get().currentUserId);
      },

      getUserById: (userId) => {
        return get().users.find((u) => u.id === userId);
      },

      addUser: (user) => {
        set((state) => ({
          users: [...state.users, user],
        }));
      },
    }),
    {
      name: "user-storage",
    },
  ),
);
