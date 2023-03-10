import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import { getPersonFromToken } from "../utils/spotify";

export const userRouter = router({
  signUp: procedure
    .input(
      z.object({
        code: z.string(),
        state: z.string(),
        redirectUri: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Spotify OAuth
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + process.env.SPOTIFY_ENCODED,
          },
          method: "POST",
          body: new URLSearchParams({
            code: input.code,
            redirect_uri: input.redirectUri,
            grant_type: "authorization_code",
          }),
        });

        const data = await response.json();
        const person = await getPersonFromToken(data.access_token);

        // Find existing user

        const possibleUser = await ctx.prisma.user.findFirst({
          where: {
            OR: [
              {
                id: person.id,
              },
              {
                email: person.email,
              },
            ],
          },
        });

        if (possibleUser) {
        } else {
        }
      } catch (error) {
        console.log(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to sign up",
          cause: error,
        });
      }
    }),
});
