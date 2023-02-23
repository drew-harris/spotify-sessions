import { StatusBar } from "expo-status-bar";
import { SafeAreaView, Text, View } from "react-native";

export default function App() {
  return (
    <SafeAreaView className="bg-red-800 text-white">
      <View>
        <Text className="bg-red-800 h-full text-white text-xl p-8 font-bold">
          Test 123
        </Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}
