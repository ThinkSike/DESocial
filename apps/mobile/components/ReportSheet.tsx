import { useThemeColors } from "@/constants/Colors";
import { api } from "@/lib/api";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ReportReason =
  | "spam"
  | "harassment"
  | "inappropriate"
  | "misinformation"
  | "other";

const REASONS: { key: ReportReason; label: string; icon: string }[] = [
  { key: "spam", label: "Spam", icon: "mail-unread-outline" },
  { key: "harassment", label: "Harassment / bullying", icon: "hand-left-outline" },
  { key: "inappropriate", label: "Inappropriate content", icon: "eye-off-outline" },
  { key: "misinformation", label: "False information", icon: "alert-circle-outline" },
  { key: "other", label: "Other", icon: "ellipsis-horizontal-outline" },
];

interface ReportSheetProps {
  visible: boolean;
  targetType: "post" | "comment";
  targetId: number;
  onClose: () => void;
}

export default function ReportSheet({
  visible,
  targetType,
  targetId,
  onClose,
}: ReportSheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = createStyles(colors);

  const [selected, setSelected] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleClose = () => {
    setSelected(null);
    setDescription("");
    setDone(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selected || busy) return;
    setBusy(true);
    try {
      await api.post("/api/reports", {
        targetType,
        targetId,
        reason: selected,
        description: description.trim() || undefined,
      });
      setDone(true);
    } catch (e: any) {
      if (e?.message?.includes("already reported")) {
        Alert.alert("Already reported", "You have already reported this content.");
        handleClose();
      } else {
        Alert.alert("Error", "Could not submit report. Please try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={s.backdrop} onPress={handleClose} />

      <View style={[s.sheet, { paddingBottom: insets.bottom + 12, backgroundColor: colors.surface }]}>
        {/* Handle */}
        <View style={s.handleWrap}>
          <View style={[s.handle, { backgroundColor: colors.border }]} />
        </View>

        {done ? (
          /* ── Success state ── */
          <View style={s.doneContainer}>
            <View style={[s.doneIcon, { backgroundColor: "#22c55e18" }]}>
              <Ionicons name="checkmark-circle" size={52} color="#22c55e" />
            </View>
            <Text style={[s.doneTitle, { color: colors.text }]}>
              Report submitted
            </Text>
            <Text style={[s.doneSubtitle, { color: colors.textSecondary }]}>
              Thank you for keeping DESocial safe. Our team will review this shortly.
            </Text>
            <TouchableOpacity style={[s.doneBtn, { backgroundColor: colors.primary }]} onPress={handleClose}>
              <Text style={s.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Report form ── */
          <>
            <View style={[s.header, { borderBottomColor: colors.border }]}>
              <Text style={[s.headerTitle, { color: colors.text }]}>
                Report {targetType}
              </Text>
              <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={[s.instruction, { color: colors.textSecondary }]}>
              Why are you reporting this?
            </Text>

            {REASONS.map((r) => (
              <TouchableOpacity
                key={r.key}
                style={[
                  s.reasonRow,
                  {
                    backgroundColor:
                      selected === r.key ? colors.primary + "15" : "transparent",
                    borderColor:
                      selected === r.key ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => setSelected(r.key)}
              >
                <Ionicons
                  name={r.icon as any}
                  size={20}
                  color={selected === r.key ? colors.primary : colors.textSecondary}
                />
                <Text
                  style={[
                    s.reasonLabel,
                    {
                      color: selected === r.key ? colors.primary : colors.text,
                      fontWeight: selected === r.key ? "600" : "400",
                    },
                  ]}
                >
                  {r.label}
                </Text>
                {selected === r.key && (
                  <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ marginLeft: "auto" }} />
                )}
              </TouchableOpacity>
            ))}

            {/* Optional description */}
            {selected && (
              <TextInput
                style={[
                  s.descInput,
                  { borderColor: colors.border, backgroundColor: colors.background, color: colors.text },
                ]}
                placeholder="Add more details (optional)"
                placeholderTextColor={colors.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                maxLength={500}
              />
            )}

            <TouchableOpacity
              style={[
                s.submitBtn,
                { backgroundColor: selected && !busy ? "#ef4444" : colors.border },
              ]}
              onPress={handleSubmit}
              disabled={!selected || busy}
            >
              {busy ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.submitBtnText}>Submit report</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
    sheet: {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 16,
    },
    handleWrap: { alignItems: "center", paddingTop: 10, paddingBottom: 4 },
    handle: { width: 36, height: 4, borderRadius: 2 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      marginBottom: 12,
    },
    headerTitle: { fontSize: 17, fontWeight: "700" },
    instruction: { fontSize: 13, marginBottom: 10 },
    reasonRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderWidth: 1.5,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 8,
    },
    reasonLabel: { fontSize: 14 },
    descInput: {
      borderWidth: 1,
      borderRadius: 10,
      padding: 12,
      fontSize: 14,
      minHeight: 72,
      marginTop: 4,
      marginBottom: 8,
    },
    submitBtn: {
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: "center",
      marginTop: 4,
    },
    submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    // Done state
    doneContainer: {
      alignItems: "center",
      paddingVertical: 32,
      gap: 12,
      paddingHorizontal: 16,
    },
    doneIcon: {
      width: 88,
      height: 88,
      borderRadius: 44,
      justifyContent: "center",
      alignItems: "center",
    },
    doneTitle: { fontSize: 22, fontWeight: "800" },
    doneSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
    doneBtn: {
      marginTop: 8,
      paddingVertical: 12,
      paddingHorizontal: 40,
      borderRadius: 12,
    },
    doneBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  });
