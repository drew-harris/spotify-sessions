import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";

export default function SplashScreen() {
  return (
    <SafeAreaView className="bg-gray-800">
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
