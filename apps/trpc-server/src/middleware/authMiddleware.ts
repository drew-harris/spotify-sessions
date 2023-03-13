import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { Payload } from "types";
import { middleware } from "../trpc";

export const authRequired = middleware(async ({ ctx, next }) => {
  if (!ctx.jwt) {
    throw new TRPCError({
      message: "Not authenticated",
      code: "UNAUTHORIZED",
    });
  }
  if (!process.env.JWT_SECRET) {
    throw new TRPCError({
      message: "JWT_SECRET is missing",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
  try {
    const decoded = jwt.verify(ctx.jwt, process.env.JWT_SECRET);
    return next({
      ctx: {
        user: decoded as Payload,
      },
    });
  } catch (error) {
    throw new TRPCError({
      message: "Bad JWT",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});
