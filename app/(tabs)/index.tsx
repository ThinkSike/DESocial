import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/constants/Colors";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={[{ backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Home</Text>
      <Button
        title="Open Chat"
        onPress={() => router.push("/chats" as any)}
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
});
