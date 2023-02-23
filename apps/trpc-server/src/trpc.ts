import { initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { prisma } from "./db";

export const createContext = (opts: CreateNextContextOptions) => {
  return {
    prisma: prisma,
  };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const procedure = t.procedure;
