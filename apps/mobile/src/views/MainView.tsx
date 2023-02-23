import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";
import { trpc } from "../utils/trpc";

export default function MainView() {
  const { data, error } = trpc.hello.useQuery({ text: "testme" });
  return (
    <SafeAreaView className="bg-red-800 text-white">
      <View>
        <Text className="bg-red-800 h-full text-center text-white text-xl p-8 font-bold">
          {error && <Text>{error.message}</Text>}
          {data && <Text>{data.message}</Text>}
        </Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}
