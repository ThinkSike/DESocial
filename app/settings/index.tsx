import { useThemeColors } from "@/constants/Colors";
import { StyleSheet, Text, Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Settings
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Logout" color="#ef4444" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
