import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm/expressions";
import { Session, sessions, users } from "drizzle-schema";
import { z } from "zod";
import { db } from "../db";
import { authProcedure } from "../middleware/authMiddleware";
import { router } from "../trpc";
import {
  getFreshToken,
  getListeningContext,
  playSession,
} from "../utils/spotify";

export const sessionsRouter = router({
  homepage: authProcedure.query(async ({ ctx }) => {
    try {
      const resultSessions: Session[] = await ctx.db
        .select()
        .from(sessions)
        .where(eq(sessions.userId, ctx.user.id))
        .orderBy(desc(sessions.timestamp));
      return resultSessions;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        message: "Could not get sessions",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  listen: authProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log("Listening to session");
        const pair =
          (
            await db
              .select()
              .from(sessions)
              .innerJoin(users, eq(sessions.userId, users.id))
              .where(
                and(
                  eq(sessions.userId, ctx.user.id),
                  eq(sessions.id, input.sessionId)
                )
              )
          ).at(0) || null;
        if (!pair) {
          throw new TRPCError({
            message: "No Session Found",
            code: "NOT_FOUND",
          });
        }
        console.log("Found session", pair);
        const result = await playSession(
          pair.sessions,
          await getFreshToken(pair.users)
        );
        return "OK" as const;
      } catch (error) {
        if (error instanceof TRPCError) {
          console.error(error);
          throw error;
        }
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  listening: authProcedure.query(async ({ ctx }) => {
    const user = (
      await ctx.db.select().from(users).where(eq(users.id, ctx.user.id))
    ).at(0);

    if (!user) {
      throw new TRPCError({
        message: "No User Found",
        code: "NOT_FOUND",
      });
    }
    const token = await getFreshToken(user);

    const context = await getListeningContext(token);
    if (!context?.is_playing) {
      return null;
    }

    return context?.context?.uri || null;
  }),

  delete: authProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await db
          .delete(sessions)
          .where(
            and(
              eq(sessions.id, input.sessionId),
              eq(sessions.userId, ctx.user.id)
            )
          );

        if (result[0].affectedRows == 1) {
          return "OK" as const;
        } else {
          throw new TRPCError({
            message: "Could not find session",
            code: "NOT_FOUND",
          });
        }
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          message: "Internal Server Error",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
