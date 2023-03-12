import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Button, SafeAreaView, Text, View } from "react-native";
import { RootStackParamList } from "../../App";
import { useAuthStore } from "../stores/authStore";
import { trpc } from "../utils/trpc";

type Props = NativeStackScreenProps<RootStackParamList, "Protected">;

export default function Protected({ navigation }: Props) {
  const { data, error } = trpc.protected.test.useQuery();
  const jwt = useAuthStore((s) => s.jwt);

  return (
    <SafeAreaView className="bg-spotify-1 h-full">
      <Button title="Back" onPress={() => navigation.pop()}></Button>
      <View className="p-4">
        <Text className="text-center text-black text-xl p-8 font-bold">
          This is a protected page
        </Text>
        <Text>JWT: {jwt}</Text>
        <Text className="text-center">{data?.message || "No message"}</Text>
        <Text>{error?.message} </Text>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
