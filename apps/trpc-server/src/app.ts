import { protectedRouter } from "./routers/protected";
import { sessionsRouter } from "./routers/sessions";
import { userRouter } from "./routers/users";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  protected: protectedRouter,
  sessions: sessionsRouter,
});

export type AppRouter = typeof appRouter;
