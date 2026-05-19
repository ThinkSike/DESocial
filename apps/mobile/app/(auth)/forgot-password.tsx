import { useThemeColors } from "@/constants/Colors";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const colors = useThemeColors();
  const [prn, setPrn] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const isValidPrn = /^\d{10}$/.test(prn.trim());
  const resolvedEmail = isValidPrn ? `${prn.trim()}@despu.edu.in` : "";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primary }]}>
        Reset Password
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Enter your PRN to receive reset instructions by email.
      </Text>

      <TextInput
        style={[
          styles.input,
          { borderColor: colors.border, color: colors.textPrimary },
        ]}
        placeholder="PRN (10 digits)"
        placeholderTextColor={colors.textSecondary}
        keyboardType="number-pad"
        value={prn}
        onChangeText={setPrn}
      />

      {message ? (
        <Text
          style={{
            alignSelf: "flex-start",
            color: status === "error" ? "#ef4444" : colors.accent,
            marginBottom: 8,
          }}
        >
          {message}
        </Text>
      ) : null}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={async () => {
          if (!prn) {
            setStatus("error");
            setMessage("Please enter your PRN.");
            return;
          }
          if (!isValidPrn) {
            setStatus("error");
            setMessage("PRN must be 10 digits.");
            return;
          }
          try {
            const data = await api.post<{ message: string }>(
              "/api/auth/forgot-password",
              { email: resolvedEmail },
              { auth: false },
            );
            setStatus("success");
            setMessage(data.message || `Reset link sent to ${resolvedEmail}.`);
          } catch (e: any) {
            setStatus("error");
            setMessage(e?.message ?? "Failed to send reset email");
          }
        }}
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
