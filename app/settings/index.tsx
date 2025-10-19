import { useThemeColors } from "@/constants/Colors";
import { StyleSheet, Text, Button, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth";

export default function SettingsScreen() {
  const colors = useThemeColors();
  const { signOut, user } = useAuthStore();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Settings
      </Text>

      {user?.email ? (
        <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
          Signed in as {user.email}
        </Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <Button title="Logout" color="#ef4444" onPress={signOut} />
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
