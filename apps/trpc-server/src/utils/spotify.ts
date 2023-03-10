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
