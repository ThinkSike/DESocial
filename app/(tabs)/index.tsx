import { useRouter } from "expo-router";
import { Button, Text, StyleSheet } from "react-native";
import { useThemeColors } from "@/constants/Colors";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView style={styles(colors).container}>
      <Text style={styles(colors).title}>DESocial</Text>

      <Button
        title="Open Chat"
        onPress={() => router.push("/chats" as any)}
        color={colors.primary}
      />
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      marginStart: 20,
      color: colors.textPrimary,
    },
  });
