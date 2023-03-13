import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm/expressions";
import { Session, sessions } from "drizzle-schema";
import { authProcedure } from "../middleware/authMiddleware";
import { router } from "../trpc";

export const sessionsRouter = router({
  homepage: authProcedure.query(async ({ ctx }) => {
    try {
      const resultSessions: Session[] = await ctx.db
        .select()
        .from(sessions)
        .where(eq(sessions.userId, ctx.user.id));
      return resultSessions;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        message: "Could not get sessions",
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
});
