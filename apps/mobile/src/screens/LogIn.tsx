import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import { RootStackParamList } from "../../App";
import { useAuthStore } from "../stores/authStore";
import { vanilla } from "../utils/trpc";

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

type Props = NativeStackScreenProps<RootStackParamList, "Log In">;

export default function LogIn({ navigation }: Props) {
  const setJwt = useAuthStore((s) => s.setJwt);
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "5b940c8bf0104d1099da47063cadfe80",
      scopes: [
        "user-read-email",
        "user-read-playback-position",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-read-currently-playing",
      ],
      usePKCE: false,
      redirectUri: makeRedirectUri({}),
    },
    discovery
  );

  const [sample] = useState(makeRedirectUri());

  useEffect(() => {
    if (response && response.type == "success") {
      vanilla.user.signUp
        .mutate({
          code: response.params.code,
          state: response.params.state,
          redirectUri: makeRedirectUri({}),
        })
        .then((res) => {
          navigation.navigate("Sessions");
          setJwt(res.token);
          console.log("TOKEN: ", res.token);
        })
        .catch((e) => {
          console.log("ERROR: ", e.message);
        });
    }
  }, [request, response, promptAsync]);

  return (
    <SafeAreaView className="bg-gray-800 text-white h-full">
      <Text className="text-center text-white text-xl p-8 font-bold">
        Log In
      </Text>
      <Button
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
      <View className="p-4">
        <Button
          title="Go to sessions"
          onPress={() => navigation.navigate("Sessions")}
        ></Button>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
