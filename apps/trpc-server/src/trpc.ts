import { initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { db } from "./db";

export const createContext = (opts: CreateNextContextOptions) => {
  console.log("createContext", opts.req.headers["auth"]);
  return {
    // TODO: Add db
    db: db,
    jwt: opts.req.headers["auth"] as string | undefined,
  };
};

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
