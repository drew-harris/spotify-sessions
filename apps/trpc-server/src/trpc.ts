import { initTRPC } from "@trpc/server";
import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { db } from "./db";

export const createContext = (opts: CreateNextContextOptions) => {
  return {
    // TODO: Add db
    db: db,
    jwt: opts.req.headers["auth"] as string | undefined,
  };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const procedure = t.procedure;
export const middleware = t.middleware;
