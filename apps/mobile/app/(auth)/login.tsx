import { useThemeColors } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function LoginScreen() {
  const colors = useThemeColors();
  const { signIn, error, clearError } = useAuthStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);

  // Clear lingering historical validation errors when components mount
  useEffect(() => {
    clearError();
  }, []);

  const trimmed = identifier.trim();
  const isStudent = /^\d{10}$/.test(trimmed);
  const isTeacher = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const accountType = isStudent ? "student" : isTeacher ? "staff / alumni" : null;

  const canSubmit = (isStudent || isTeacher) && password.length >= 1 && !busy;

  const handleLogin = async () => {
    if (!canSubmit) return;
    clearError();
    setBusy(true);
    try {
      // Passes credentials securely directly down to the store configuration
      await signIn(trimmed, password);
    } catch (err) {
      // Fallback local execution logging if handling fails upstream
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inner}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary + "18" }]}>
            <Ionicons name="school" size={44} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary || colors.text }]}>
            DESocial
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            DESPU's campus network
          </Text>

          <View style={styles.form}>
            {/* Account Identifier Input */}
            <View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Enrollment number or email
              </Text>
              <View
                style={[
                  styles.inputRow,
                  {
                    borderColor: accountType ? colors.primary : colors.border,
                    backgroundColor: colors.surface,
                  },
                ]}
              >
                <Ionicons
                  name={isTeacher ? "mail-outline" : "person-outline"}
                  size={18}
                  color={colors.textSecondary}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary || colors.text }]}
                  placeholder="e.g. 1012412071 or name@despu.edu.in"
                  placeholderTextColor={colors.textSecondary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType={isTeacher ? "email-address" : "default"}
                  value={identifier}
                  onChangeText={(val) => {
                    setIdentifier(val);
                    if (error) clearError();
                  }}
                  returnKeyType="next"
                  editable={!busy}
                />
              </View>
              {accountType && (
                <Text style={[styles.hint, { color: colors.primary }]}>
                  Detected: {accountType} account
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View>
              <View style={styles.passwordLabelRow}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                <Link href="/(auth)/forgot-password" asChild>
                  <TouchableOpacity disabled={busy}>
                    <Text style={[styles.forgotText, { color: colors.accent }]}>Forgot?</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              <View
                style={[
                  styles.inputRow,
                  { borderColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={colors.textSecondary}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={[styles.input, { color: colors.textPrimary || colors.text }]}
                  placeholder="Password"
                  placeholderTextColor={colors.textSecondary}
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (error) clearError();
                  }}
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  editable={!busy}
                />
                <TouchableOpacity 
                  onPress={() => setShowPass((s) => !s)} 
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPass ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message Box */}
            {error ? (
              <View style={[styles.errorBox, { backgroundColor: "#fef2f2", borderColor: "#fca5a5" }]}>
                <Ionicons name="warning-outline" size={16} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: canSubmit ? colors.primary : colors.border },
              ]}
              onPress={handleLogin}
              disabled={!canSubmit}
              activeOpacity={0.85}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="log-in-outline" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Sign in</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={[styles.footNote, { color: colors.textSecondary }]}>
              Don't have an account? Contact your campus admin.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 30, fontWeight: "800", letterSpacing: 0.5 },
  subtitle: { fontSize: 14, marginBottom: 32 },
  form: { width: "100%", gap: 16 },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotText: { fontSize: 13, fontWeight: "500", marginBottom: 6, paddingHorizontal: 4 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },
  input: { flex: 1, fontSize: 15 },
  hint: { fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: "500" },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  errorText: { color: "#ef4444", fontSize: 13, flex: 1, fontWeight: "500" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 4,
  },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  footNote: { fontSize: 13, textAlign: "center", marginTop: 8 },
});