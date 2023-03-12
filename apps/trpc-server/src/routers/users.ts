import { TRPCError } from "@trpc/server";
import jwt from "jsonwebtoken";
import { users } from "drizzle-schema";
import { InferModel } from "drizzle-orm/mysql-core/table";
import { z } from "zod";
import { procedure, router } from "../trpc";
import { getPersonFromToken } from "../utils/spotify";
import { eq } from "drizzle-orm/expressions";
import { Payload } from "types";

type NewUser = InferModel<typeof users>;

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
        console.log("data", data);
        const person = await getPersonFromToken(data.access_token);

        // Find existing user

        const possibleUsers = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, person.id))
          .limit(1);

        console.log("possible users", possibleUsers);

        if (possibleUsers.length !== 0) {
          throw new TRPCError({
            message: "User already exists",
            code: "BAD_REQUEST",
          });
        }

        const newUser: NewUser = {
          id: person.id,
          email: person.email,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: new Date(data.expires_in * 1000 + Date.now()),
          createdAt: new Date(),
          displayName: person.display_name ?? null,
        };
        //try creating user
        await ctx.db.insert(users).values(newUser);
        const payload: Payload = {
          id: newUser.id,
          displayName: newUser.displayName,
          email: newUser.email,
        };

        if (!process.env.JWT_SECRET) {
          throw new TRPCError({
            message: "JWT_SECRET is missing",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        return {
          token,
        };
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
