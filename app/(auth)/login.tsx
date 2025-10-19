import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useAuthStore } from "@/store/auth";

export default function LoginScreen() {
  const colors = useThemeColors();
  const { signIn, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    if (!email || !password || busy) return;
    clearError();
    setBusy(true);
    try {
      await signIn(email, password);
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.inner}>
        <Text style={[styles.title, { color: colors.primary }]}>
          Lets get going!
        </Text>

        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.textPrimary },
          ]}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.textPrimary },
          ]}
          placeholder="Password"
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity>
            <Text style={[styles.forgotText, { color: colors.accent }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </Link>

        {error ? (
          <Text style={{ color: "#ef4444", alignSelf: "flex-start" }}>
            {String(error)}
          </Text>
        ) : null}

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: busy || !email || !password ? 0.6 : 1,
            },
          ]}
          onPress={handleLogin}
          disabled={busy || !email || !password}
        >
          {busy ? (
            <ActivityIndicator color={colors.surface} />
          ) : (
            <>
              <Ionicons
                name="log-in-outline"
                size={20}
                color={colors.surface}
              />
              <Text style={[styles.buttonText, { color: colors.surface }]}>
                Login
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  inner: { alignItems: "center", gap: 16 },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 8 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  forgotText: { alignSelf: "flex-end", fontSize: 14 },
  button: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingVertical: 12,
    width: "100%",
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});
