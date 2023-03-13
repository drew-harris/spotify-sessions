import { authRequired } from "../middleware/authMiddleware";
import { procedure, router } from "../trpc";

export const protectedRouter = router({
  test: procedure.use(authRequired).query(({ input, ctx }) => {
    console.log("input", ctx.user);
    return { message: "Hello World" };
  }),
});
