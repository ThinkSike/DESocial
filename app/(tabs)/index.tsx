import { useRouter } from "expo-router";
import { Button, Text } from "react-native";
import { useThemeColors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={[{ backgroundColor: colors.background }]}>
      <Text style={[{ color: colors.textPrimary }]}>DESocial</Text>
      <Button
        title="Open Chat"
        onPress={() => router.push("/chats" as any)}
        color={colors.primary}
      />
    </SafeAreaView>
  );
}
