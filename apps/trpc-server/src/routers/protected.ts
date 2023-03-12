import { procedure, router } from "../trpc";

export const protectedRouter = router({
  test: procedure.query(async ({ input, ctx }) => {
    console.log("input", input);
    return { hello: "world" };
  }),
});
