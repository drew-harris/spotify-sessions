import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

interface AuthStore {
  jwt: string | null;
  loaded: boolean;
  setJwt: (jwt: string | null) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  jwt: null,
  initialize: async () => {
    get().setJwt((await SecureStore.getItemAsync("jwt")) || null);
  },
  setJwt: async (jwt: string | null) => {
    set({ jwt, loaded: true });
    if (jwt) {
      await SecureStore.setItemAsync("jwt", jwt);
    }
  },
  loaded: false,
}));
