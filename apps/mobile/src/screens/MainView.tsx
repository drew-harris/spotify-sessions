import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text } from "react-native";
import { trpc } from "../utils/trpc";

export default function MainView() {
  const { data, error } = trpc.hello.useQuery({ text: "testme" });

  return (
    <SafeAreaView className="bg-spotify-1">
      <Text className="h-full text-center text-black text-xl p-8 font-bold">
        {error && <Text>{error.message}</Text>}
        {data && <Text>{data.message}</Text>}
      </Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}