import { eq } from "drizzle-orm/expressions";
import { User, users } from "drizzle-schema";
import { db } from "../db";

export async function getPersonFromToken(token: string) {
  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (response.status !== 200) {
    throw new Error("Failed to get person");
  }

  const data =
    (await response.json()) as SpotifyApi.CurrentUsersProfileResponse;

  return data;
}

export async function getFreshToken(user: User): Promise<string> {
  // Expired
  if (user.expiresAt < new Date()) {
    return refreshToken(user);
  } else {
    return user.accessToken;
  }
}

// Refresh spotify token, update database and return the token
export async function refreshToken(user: User): Promise<string> {
  console.log("Refreshing token");
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + process.env.SPOTIFY_ENCODED,
      },
      method: "POST",
      body: new URLSearchParams({
        refresh_token: user.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (response.status !== 200) {
      console.log("Failed to refresh token");
      console.error(await response.json());
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    // update the database
    await db
      .update(users)
      .set({
        accessToken: data.access_token,
        expiresAt: new Date(data.expires_in * 1000 + Date.now()),
      })
      .where(eq(users.id, user.id));

    console.log(data);
    return data.access_token;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
}

export async function getListeningContext(token: string) {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (response.status != 200) {
      console.log("TEXT", await response.text());
      return null;
    }
    const data = await response.json();
    return data as SpotifyApi.CurrentlyPlayingResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
