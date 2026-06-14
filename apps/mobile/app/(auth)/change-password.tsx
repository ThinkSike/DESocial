import { useThemeColors } from "@/constants/Colors";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChangePasswordScreen() {
  const colors = useThemeColors();
  const { hydrate } = useAuthStore();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Fixed: Dedicated separate toggle visibility state

  const passwordsMatch = next === confirm;
  const canSubmit =
    current.length > 0 && next.length >= 8 && passwordsMatch && !busy;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    try {
      await api.post("/api/auth/change-password", {
        currentPassword: current,
        newPassword: next,
      });
      // Re-hydrate forces a user object profile reload down to the global store layer.
      // The auth layouts will immediately catch mustChangePassword -> false and route to (tabs).
      await hydrate();
    } catch (e: any) {
      Alert.alert(
        "Could not change password",
        e?.response?.data?.message || e?.message || "Please check your temporary password and try again.",
      );
    } finally {
      setBusy(false);
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
          <View style={styles.inner}>
            <View style={[styles.iconCircle, { backgroundColor: colors.primary + "18" }]}>
              <Ionicons name="key-outline" size={40} color={colors.primary} />
            </View>

            <Text style={[styles.title, { color: colors.textPrimary || colors.text }]}>
              Set your password
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Your admin set a temporary password.{"\n"}Choose a strong new one to secure your account.
            </Text>

            <View style={styles.form}>
              {/* Current / temp password */}
              <PasswordField
                label="Temporary password"
                value={current}
                onChangeText={setCurrent}
                show={showCurrent}
                onToggle={() => setShowCurrent((s) => !s)}
                colors={colors}
                editable={!busy}
              />

              {/* New password */}
              <PasswordField
                label="New password (min. 8 characters)"
                value={next}
                onChangeText={setNext}
                show={showNext}
                onToggle={() => setShowNext((s) => !s)}
                colors={colors}
                editable={!busy}
              />

              {/* Confirm */}
              <PasswordField
                label="Confirm new password"
                value={confirm}
                onChangeText={setConfirm}
                show={showConfirm}
                onToggle={() => setShowConfirm((s) => !s)}
                colors={colors}
                editable={!busy}
                error={
                  confirm.length > 0 && !passwordsMatch
                    ? "Passwords don't match"
                    : undefined
                }
              />

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: canSubmit ? colors.primary : colors.border },
                ]}
                onPress={handleSubmit}
                disabled={!canSubmit}
                activeOpacity={0.85}
              >
                {busy ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Set password & continue</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  show,
  onToggle,
  colors,
  error,
  editable,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  show: boolean;
  onToggle: () => void;
  colors: any;
  error?: string;
  editable?: boolean;
}) {
  return (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          {
            borderColor: error ? "#ef4444" : colors.border,
            backgroundColor: colors.surface,
            opacity: editable === false ? 0.7 : 1,
          },
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
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!show}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          editable={editable}
        />
        <TouchableOpacity
          onPress={onToggle}
          disabled={editable === false}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={show ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.fieldErrorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: "100%",
    paddingHorizontal: 28,
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 4 },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  form: { width: "100%", gap: 16 },
  fieldContainer: { width: "100%" },
  label: { fontSize: 13, fontWeight: "500", marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
  },
  input: { flex: 1, fontSize: 15 },
  fieldErrorText: { color: "#ef4444", fontSize: 12, marginTop: 4, marginLeft: 4, fontWeight: "500" },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 8,
  },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});