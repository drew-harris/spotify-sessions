import { initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { db } from "./db";

export const createContext = (_opts: CreateNextContextOptions) => {
  return {
    // TODO: Add db
    db: db,
  };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const procedure = t.procedure;
