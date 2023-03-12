import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { Button, SafeAreaView, Text } from "react-native";
import { RootStackParamList } from "../../App";
import { trpc } from "../utils/trpc";

type Props = NativeStackScreenProps<RootStackParamList, "Protected">;

export default function Protected({ navigation }: Props) {
  const { data, error } = trpc.protected.test.useQuery();

  return (
    <SafeAreaView className="bg-spotify-1 h-full">
      <Button title="Back" onPress={() => navigation.pop()}></Button>
      {/* <Button title="check" onPress={() => fetchData()}></Button> */}
      <Text className="text-center text-black text-xl p-8 font-bold">
        This is a protected page
      </Text>
      <Text>{data?.hello || "No message"}</Text>
      <Text>{error?.message} </Text>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
