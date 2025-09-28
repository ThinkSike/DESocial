import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { useThemeColors } from "@/constants/Colors";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 12,
  },
});
