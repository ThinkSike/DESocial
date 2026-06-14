import { useThemeColors } from "@/constants/Colors";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isValidPrn = /^\d{10}$/.test(prn.trim());
  const resolvedEmail = isValidPrn ? `${prn.trim()}@despu.edu.in` : "";

  const handleResetRequest = async () => {
    if (!prn.trim()) {
      setStatus("error");
      setMessage("Please enter your PRN.");
      return;
    }
    if (!isValidPrn) {
      setStatus("error");
      setMessage("PRN must be exactly a 10-digit number.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const data = await api.post<{ message: string }>(
        "/api/auth/forgot-password",
        { email: resolvedEmail },
        { auth: false }
      );
      setStatus("success");
      setMessage(data.message || `Reset link successfully sent to ${resolvedEmail}`);
    } catch (e: any) {
      setStatus("error");
      // Handle missing server responses or infrastructure drops gracefully
      setMessage(e?.response?.data?.message || e?.message || "Failed to transmit reset instructions.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.primary }]}>Reset Password</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Enter your student PRN below. We will send a secure password reset verification link to your official institutional email box.
          </Text>

          <TextInput
            style={[
              styles.input,
              { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface || "#fff" },
            ]}
            placeholder="PRN (e.g., 1012412071)"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            maxLength={10}
            value={prn}
            onChangeText={(val) => {
              setPrn(val);
              if (status !== "idle") setStatus("idle");
            }}
            editable={status !== "loading"}
          />

          {resolvedEmail && isValidPrn ? (
            <Text style={[styles.emailHint, { color: colors.primary }]}>
              Target Email: {resolvedEmail}
            </Text>
          ) : null}

          {message ? (
            <View style={[styles.alertBox, { backgroundColor: status === "error" ? "#fef2f2" : "#f0fdf4" }]}>
              <Ionicons 
                name={status === "error" ? "alert-circle-outline" : "checkmark-circle-outline"} 
                size={16} 
                color={status === "error" ? "#ef4444" : "#22c55e"} 
              />
              <Text style={[styles.alertText, { color: status === "error" ? "#ef4444" : "#16a34a" }]}>
                {message}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[
              styles.button, 
              { backgroundColor: colors.primary, opacity: status === "loading" ? 0.7 : 1 }
            ]}
            onPress={handleResetRequest}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <ActivityIndicator color={colors.surface} />
            ) : (
              <>
                <Ionicons name="mail-outline" size={20} color={colors.surface} />
                <Text style={[styles.buttonText, { color: colors.surface }]}>Send Reset Link</Text>
              </>
            )}
          </TouchableOpacity>

          <Link href="/(auth)/login" asChild>
            <TouchableOpacity disabled={status === "loading"}>
              <Text style={[styles.backText, { color: colors.accent }]}>Back to Login</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  subtitle: { fontSize: 14, marginBottom: 20, textAlign: "center", lineHeight: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  emailHint: {
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 16,
    marginLeft: 4,
    fontWeight: "500"
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 16,
  },
  alertText: { fontSize: 13, flex: 1, fontWeight: "500" },
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
  backText: { fontSize: 14, fontWeight: "500", padding: 8 },
});