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
import { RouterOutput, trpc } from "../utils/trpc";

type Props = NativeStackScreenProps<RootStackParamList, "Sessions">;

export default function SessionsPage({ navigation }: Props) {
  const { data, refetch } = trpc.sessions.homepage.useQuery();
  const [refreshing, setRefreshing] = useState(false);
  const playMutation = trpc.sessions.listen.useMutation({
    onSuccess: (result) => {
      if (result === "OK") {
        refetchPlayingUri();
      }
    },

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

  const { data: playingUri, refetch: refetchPlayingUri } =
    trpc.sessions.listening.useQuery();

  const playSession = (sessionId: string) => {
    console.log("playSession", sessionId);
    playMutation.mutate({
      sessionId,
    });
  };

  const update = async () => {
    setRefreshing(true);
    await updateListening();
    await refetch();
    setRefreshing(false);
  };

  const updateListening = async () => {
    try {
      await fetch("https://spotify-sessions-next.vercel.app/api/update");
      refetchPlayingUri();
      refetch();
    } catch (error) {}
  };

  return (
    <SafeAreaView className="bg-gray-900 text-white h-full">
      <ScrollView
        className="p-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => update()}
          ></RefreshControl>
        }
      >
        {data?.map((s) => (
          <SessionCard
            playSession={playSession}
            currentlyPlaying={playingUri}
            session={s}
            key={s.id}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const SessionCard = ({
  session,
  playSession,
  currentlyPlaying,
}: {
  session: RouterOutput["sessions"]["homepage"][0];
  playSession: (sessionId: string) => void;
  currentlyPlaying: string | undefined | null;
}) => {
  return (
    <View className="m-1 bg-gray-800 rounded-lg p-3 flex flex-row">
      <Image source={{ uri: session.albumArt, width: 80, height: 80 }}></Image>
      <View className="ml-3">
        <Text className="text-white font-bold">{session.albumName}</Text>
        <Text className="text-white text-sm">{session.trackName}</Text>
        {currentlyPlaying !== session.contextUri && (
          <Pressable onPress={() => playSession(session.id)}>
            <Text className="text-white mt-4">Play</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
