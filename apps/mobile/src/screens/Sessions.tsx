import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Button, Image, SafeAreaView, Text, View } from "react-native";
import { RootStackParamList } from "../../App";
import { trpc, RouterOutput } from "../utils/trpc";

type Props = NativeStackScreenProps<RootStackParamList, "Sessions">;

export default function SessionsPage({ navigation }: Props) {
  const { data } = trpc.sessions.homepage.useQuery();
  return (
    <SafeAreaView className="bg-gray-800 text-white h-full">
      <Button title="Back" onPress={() => navigation.pop()}></Button>
      <View className="p-4">
        <Text className="text-center  text-white text-xl mb-2 font-bold">
          Sessions page
        </Text>
        {data?.map((s) => (
          <SessionCard session={s} key={s.id} />
        ))}
      </View>
    </SafeAreaView>
  );
}

const SessionCard = ({
  session,
}: {
  session: RouterOutput["sessions"]["homepage"][0];
}) => {
  return (
    <View className="border-gray-700 border-2 m-1 p-2 flex flex-row">
      <Image source={{ uri: session.albumArt, width: 80, height: 80 }}></Image>
      <View className="ml-3">
        <Text className="text-white font-bold">{session.albumName}</Text>
        <Text className="text-white text-sm">{session.trackName}</Text>
      </View>
    </View>
  );
};
