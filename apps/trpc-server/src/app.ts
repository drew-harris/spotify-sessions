import { z } from "zod";
import { procedure, router } from "./trpc";

export const appRouter = router({
  hello: procedure
    .input(
      z.object({
        text: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const message = await ctx.prisma.test.findFirst({});
      return {
        greeting: `hello ${input.text}`,
        message: message?.message,
      };
    }),
});

export type AppRouter = typeof appRouter;
