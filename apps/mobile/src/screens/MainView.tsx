import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text } from "react-native";

export default function MainView() {
  return (
    <SafeAreaView className="bg-spotify-1">
      <Text className="h-full text-center text-black text-xl p-8 font-bold"></Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
