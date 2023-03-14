import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { RootStackParamList } from "../../App";
import { useAuthStore } from "../stores/authStore";
import { RouterOutput, trpc } from "../utils/trpc";

type Props = NativeStackScreenProps<RootStackParamList, "Sessions">;

export default function SessionsPage({ navigation }: Props) {
  const signOut = useAuthStore((s) => s.signOut);
  const { data, refetch } = trpc.sessions.homepage.useQuery();
  const [refreshing, setRefreshing] = useState(false);
  const playMutation = trpc.sessions.listen.useMutation({
    onError: (e, reqSession) => {
      Alert.alert("Error", e.message, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
        {
          text: "Open Track In App",
          onPress: () => {
            const session = data?.find((s) => s.id == reqSession.sessionId);
            if (session) {
              const url =
                "https://open.spotify.com/track/" +
                session.trackId +
                "?" +
                new URLSearchParams({
                  context: session.contextUri,
                  position_ms: session.progress.toString(),
                  pms: session.progress.toString(),
                });

              Linking.openURL(url);
            }
          },
        },
      ]);
    },
  });

  const playSession = (sessionId: string) => {
    console.log("playSession", sessionId);
    playMutation.mutate({
      sessionId,
    });
  };

  const update = async () => {
    setRefreshing(true);
    const listeningPromise = updateListening();
    const refetchPromise = refetch();
    await Promise.all([listeningPromise, refetchPromise]);
    setRefreshing(false);
  };

  const updateListening = async () => {
    try {
      await fetch("https://spotify-sessions-next.vercel.app/api/update");
      refetch();
    } catch (error) {}
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-gray-900 text-white h-full">
      <ScrollView
        className="p-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => update()}
          ></RefreshControl>
        }
      >
        <Text className="text-white font-bold text-3xl">Sessions</Text>
        {data?.map((s) => (
          <SessionCard playSession={playSession} session={s} key={s.id} />
        ))}
        <Pressable onPress={() => signOut()}>
          <Text>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const SessionCard = ({
  session,
  playSession,
}: {
  session: RouterOutput["sessions"]["homepage"][0];
  playSession: (sessionId: string) => void;
}) => {
  return (
    <View className="m-1 bg-gray-800 overflow-hidden rounded-lg p-3 flex flex-row">
      <Image
        source={{ uri: session.albumArt, width: 80, height: 80 }}
        className="rounded-md"
      ></Image>
      <View className="ml-3 overflow-hidden">
        <Text className="text-white font-bold text-ellipsis">
          {session.albumName}
        </Text>
        <Text className="text-white text-sm">{session.trackName}</Text>
        <Pressable onPress={() => playSession(session.id)}>
          <Text className="text-white underline mt-4">Play</Text>
        </Pressable>
      </View>
    </View>
  );
};
