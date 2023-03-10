import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text } from "react-native";
import { vanilla } from "../utils/trpc";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

export default function LogIn() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "5b940c8bf0104d1099da47063cadfe80",
      scopes: ["user-read-email", "playlist-modify-public"],
      usePKCE: false,
      redirectUri: makeRedirectUri({}),
    },
    discovery
  );

  const [sample] = useState(makeRedirectUri());

  useEffect(() => {
    if (response && response.type == "success") {
      vanilla.user.signUp.mutate({
        code: response.params.code,
        state: response.params.state,
        redirectUri: makeRedirectUri({}),
      });
    }
  }, [request, response, promptAsync]);

  return (
    <SafeAreaView className="bg-spotify-1">
      <Text className="text-center text-black text-xl p-8 font-bold">
        Log In
      </Text>
      <Button
        // disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
      <Text>{JSON.stringify(response)}</Text>
      <Text>{sample}</Text>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
