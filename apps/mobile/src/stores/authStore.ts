import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface AuthStore {
  jwt: string | null;
  expires: Date | null;
  loaded: boolean;
  setJwt: (jwt: string | null) => Promise<void>;
  setExpires: (expires: Date | null) => Promise<void>;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  jwt: null,
  expires: null,
  loaded: false,
  initialize: async () => {
    const dateString = await SecureStore.getItemAsync("expires");
    if (dateString) {
      set({ expires: new Date(dateString) });
    }
    get().setJwt((await SecureStore.getItemAsync("jwt")) || null);
    set({ loaded: true });
  },
  setJwt: async (jwt: string | null) => {
    set({ jwt, loaded: true });
    if (jwt) {
      await SecureStore.setItemAsync("jwt", jwt);
    }
  },
  setExpires: async (expires: Date | null) => {
    set({ expires });
    if (expires) {
      await SecureStore.setItemAsync("expires", expires.toISOString());
    }
  },

  signOut: async () => {
    await SecureStore.deleteItemAsync("jwt");
    await SecureStore.deleteItemAsync("expires");
    set({ jwt: null, expires: null });
  },
}));
