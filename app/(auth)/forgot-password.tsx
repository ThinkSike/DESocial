import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const [email, setEmail] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Reset Password
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter your email to receive reset instructions.
      </Text>

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => console.log("Reset link sent")}
      >
        <Ionicons name="mail-outline" size={20} color={colors.surface} />
        <Text style={[styles.buttonText, { color: colors.surface }]}>
          Send Reset Link
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/login" asChild>
        <TouchableOpacity>
          <Text style={[styles.backText, { color: colors.accent }]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: { fontSize: 26, fontWeight: "600", marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 16,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
  backText: { fontSize: 14 },
});
