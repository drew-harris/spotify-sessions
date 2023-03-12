import { authRequired } from "../middleware/authMiddleware";
import { procedure, router } from "../trpc";

export const protectedRouter = router({
  test: procedure.use(authRequired).query(async ({ input, ctx }) => {
    console.log("input", ctx.jwt);
    return { message: "Hello World" };
  }),
});
