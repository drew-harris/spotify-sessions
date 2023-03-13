import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Image,
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
  const playMutation = trpc.sessions.listen.useMutation({
    onSuccess: (result) => {
      if (result === "OK") {
        refetchPlayingUri();
      }
    },
  });

  const { data: playingUri, refetch: refetchPlayingUri } =
    trpc.sessions.listening.useQuery({});

  const playSession = (sessionId: string) => {
    console.log("playSession", sessionId);
    playMutation.mutate({
      sessionId,
    });
  };

  const updateListening = async () => {
    try {
      await fetch("https://spotify-sessions-next.vercel.app/api/update");
      refetchPlayingUri();
      refetch();
    } catch (error) {}
  };

  return (
    <SafeAreaView className="bg-gray-800 text-white h-full">
      <Button title="Back" onPress={() => navigation.pop()}></Button>
      <ScrollView className="p-4">
        <Text className="text-center  text-white text-xl mb-2 font-bold">
          Sessions page
        </Text>
        <Button
          title="refresh"
          onPress={() => {
            refetch();
            refetchPlayingUri();
          }}
        ></Button>
        <Button
          title="listen"
          onPress={() => {
            updateListening();
          }}
        ></Button>
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
  currentlyPlaying: string | undefined;
}) => {
  return (
    <View className="border-gray-700 border-2 m-1 p-2 flex flex-row">
      <Image source={{ uri: session.albumArt, width: 80, height: 80 }}></Image>
      <View className="ml-3">
        <Text className="text-white font-bold">{session.albumName}</Text>
        <Text className="text-white text-sm">{session.trackName}</Text>
        {currentlyPlaying !== session.contextUri && (
          <Button
            color={"#ffffff"}
            onPress={() => playSession(session.id)}
            title="Play"
          ></Button>
        )}
      </View>
    </View>
  );
};
