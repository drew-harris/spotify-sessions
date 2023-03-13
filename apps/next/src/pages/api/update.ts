import { and, eq } from "drizzle-orm/expressions";
import { sessions, users } from "drizzle-schema";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  createSession,
  getFreshToken,
  getListeningContext,
  updateSession,
} from "trpc-server";
import { db } from "trpc-server/src/db";

// Hook to update the latest session
export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("UPDATE!!!");
  // get the first user
  try {
    const user = await db.select().from(users).limit(1);
    if (user.length === 0) {
      throw new Error("No user");
    }
    const token = await getFreshToken(user[0]);
    const context = await getListeningContext(token);
    console.log("CONTEXT: ", context);
    if (!context || !context.context || !context?.context.uri) {
      return res.json({ message: "not an album" });
    }

    if (context.context.type !== "album") {
      console.log("NOT AN ALBUM");
      return res.json({ message: "not an album" });
    }

    // @ts-ignore // TODO: FIX
    if (context.item.album.album_group === "single") {
      console.log("NOT AN ALBUM");
      return res.json({ message: "single" });
    }

    const matchingSessions = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.contextUri, context?.context?.uri),
          eq(sessions.userId, user[0].id)
        )
      );

    if (matchingSessions.length === 0) {
      // create the session
      createSession(user[0], context);
    } else {
      // update the session
      updateSession(matchingSessions[0], context);
    }

    return res.json(context);
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ error: error.message || "There was an internal error" });
  }
}
