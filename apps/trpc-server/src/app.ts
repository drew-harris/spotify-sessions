import { protectedRouter } from "./routers/protected";
import { userRouter } from "./routers/users";
import { router } from "./trpc";

export const appRouter = router({
  user: userRouter,
  protected: protectedRouter,
});

export type AppRouter = typeof appRouter;
