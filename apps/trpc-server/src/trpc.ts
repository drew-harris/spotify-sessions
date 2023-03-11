import { initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";

export const createContext = (_opts: CreateNextContextOptions) => {
  return {
    // TODO: Add db
  };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const procedure = t.procedure;
