import { v4 as uuidv4 } from "uuid";
import { and, eq } from "drizzle-orm/expressions";
import { Session, sessions, User } from "drizzle-schema";
import { db } from "../db";

export const createSession = async (
  user: User,
  context: SpotifyApi.CurrentlyPlayingResponse | any
) => {
  if (!context.item) {
    throw new Error("No context item");
  }
  const session: Session = {
    id: uuidv4(),
    timestamp: new Date(),
    contextTimestamp: new Date(context.timestamp),
    progress: context.progress_ms || 0,
    trackId: context.item.id,
    albumArt: context.item.album.images[0].url,
    albumName: context.item.album.name,
    artistName: context.item.artists[0].name,
    trackNumber: context.item.track_number,
    contextUri: context.context.uri,
    externalUrl: context.context.external_urls.spotify,
    item: {},
    previewUrl: context.item.preview_url,
    trackName: context.item.name,
    trackUri: context.item.uri,
    userId: user.id,
  };
  console.log(session);

  await db.insert(sessions).values(session);
  return session;
};

export const updateSession = async (previousSession: Session, context: any) => {
  console.log("updating session", previousSession);
  await db
    .update(sessions)
    .set({
      timestamp: new Date(),
      contextTimestamp: new Date(context.timestamp),
      progress: context.progress_ms || 0,
      trackId: context.item.id,
      albumArt: context.item.album.images[0].url || null,
      albumName: context.item.album.name,
      artistName: context.item.artists[0].name,
      trackNumber: context.item.track_number,
      item: {},
      previewUrl: context.item.preview_url || null,
      trackName: context.item.name,
      trackUri: context.item.uri,
    })
    .where(
      and(
        eq(sessions.userId, previousSession.userId || ""),
        eq(sessions.contextUri, context.context.uri)
      )
    );
};
