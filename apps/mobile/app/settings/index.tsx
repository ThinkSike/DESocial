import { useThemeColors } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const APP_VERSION = "1.0.0";
const SUPPORT_EMAIL = "support@desocial.in";
const WEBSITE_URL = "https://desocial.in";

const FAQ_ITEMS = [
  {
    question: "How do I join a community?",
    answer:
      "Go to the Forum tab, tap 'Browse Communities' or look at the 'Discover' sidebar. Find a community you like and tap the 'Join' button. You'll start seeing its posts in your feed immediately.",
  },
  {
    question: "How do I post in a community?",
    answer:
      "Navigate to the Forum tab and select a community you've joined from the sidebar. A post composer will appear at the top of the feed — type your message and tap 'Post'.",
  },
  {
    question: "How do I change my profile picture?",
    answer:
      "Go to the Profile tab and tap on your profile picture. You'll be prompted to allow photo library access. Select a photo and it will upload automatically.",
  },
  {
    question: "How do I edit my bio or username?",
    answer:
      "On the Profile tab, tap 'Add profile section'. This opens the edit modal where you can update your display name, username, and bio.",
  },
  {
    question: "How do I follow another student?",
    answer:
      "Tap on any user's avatar or name from a post or the search results. On their profile, tap the 'Follow' button.",
  },
  {
    question: "How do I search for people or posts?",
    answer:
      "Tap the Search tab (magnifying glass icon at the bottom). Type a name, username, or keyword to find people and posts across the campus network.",
  },
  {
    question: "Can I delete my posts?",
    answer:
      "Yes. On any post you've created, tap the three-dot menu (⋯) in the top-right corner of the post and select 'Delete'.",
  },
  {
    question: "Is my data private?",
    answer:
      "Your profile is visible to other verified DES Pune students. Analytics (profile views etc.) are private to you only. We do not share your data with third parties.",
  },
];

export default function SettingsScreen() {
  const { signOut, user } = useAuthStore();
  const colors = useThemeColors();
  const router = useRouter();
  const s = styles(colors);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq((prev) => (prev === index ? null : index));
  };

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() =>
      Alert.alert("Error", "Could not open link.")
    );
  };

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={s.sectionHeader}>{title}</Text>
  );

  const RowItem = ({
    icon,
    label,
    value,
    onPress,
    destructive,
    hideChevron,
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    destructive?: boolean;
    hideChevron?: boolean;
  }) => (
    <TouchableOpacity
      style={s.row}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View style={[s.rowIcon, { backgroundColor: colors.primary + "18" }]}>
        <Ionicons
          name={icon as any}
          size={18}
          color={destructive ? "#ef4444" : colors.primary}
        />
      </View>
      <View style={s.rowContent}>
        <Text style={[s.rowLabel, destructive && { color: "#ef4444" }]}>
          {label}
        </Text>
        {value ? <Text style={s.rowValue}>{value}</Text> : null}
      </View>
      {!hideChevron && onPress && (
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Account ── */}
        <SectionHeader title="Account" />
        <View style={s.card}>
          <View style={s.row}>
            <View style={[s.rowIcon, { backgroundColor: colors.primary + "18" }]}>
              <Ionicons name="person-circle" size={18} color={colors.primary} />
            </View>
            <View style={s.rowContent}>
              <Text style={s.rowLabel}>Signed in as</Text>
              <Text style={s.rowValue}>{user?.email ?? "—"}</Text>
            </View>
          </View>

          <View style={s.divider} />

          <RowItem
            icon="create-outline"
            label="Edit Profile"
            onPress={() => {
              router.back();
            }}
          />

          <View style={s.divider} />

          <RowItem
            icon="log-out-outline"
            label="Sign Out"
            onPress={handleSignOut}
            destructive
            hideChevron
          />
        </View>

        {/* ── About Us ── */}
        <SectionHeader title="About Us" />
        <View style={s.card}>
          <View style={s.aboutBanner}>
            <View style={[s.logoCircle, { backgroundColor: colors.primary }]}>
              <Text style={s.logoText}>DE</Text>
            </View>
            <View style={{ marginLeft: 14, flex: 1 }}>
              <Text style={s.appName}>DESocial</Text>
              <Text style={s.appVersion}>Version {APP_VERSION}</Text>
            </View>
          </View>

          <Text style={s.aboutDescription}>
            DESocial is the official campus social network for students and
            faculty of{" "}
            <Text style={{ fontWeight: "700", color: colors.primary }}>
              Dr. D.Y. Patil College of Engineering & Technology
            </Text>{" "}
            (DES Pune). It connects students across departments through
            communities, forums, events, and a shared campus feed.
          </Text>

          <View style={s.divider} />

          <RowItem
            icon="globe-outline"
            label="Website"
            value={WEBSITE_URL}
            onPress={() => openLink(WEBSITE_URL)}
          />

          <View style={s.divider} />

          <RowItem
            icon="mail-outline"
            label="Contact Support"
            value={SUPPORT_EMAIL}
            onPress={() => openLink(`mailto:${SUPPORT_EMAIL}`)}
          />

          <View style={s.divider} />

          <RowItem
            icon="location-outline"
            label="Campus"
            value="Pune, Maharashtra, India"
            hideChevron
          />
        </View>

        {/* ── Help & FAQ ── */}
        <SectionHeader title="Help & FAQ" />
        <View style={s.card}>
          {FAQ_ITEMS.map((item, index) => (
            <View key={index}>
              {index > 0 && <View style={s.divider} />}
              <TouchableOpacity
                style={s.faqRow}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <Text style={s.faqQuestion} numberOfLines={expandedFaq === index ? undefined : 1}>
                  {item.question}
                </Text>
                <Ionicons
                  name={
                    expandedFaq === index ? "chevron-up" : "chevron-down"
                  }
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              {expandedFaq === index && (
                <Text style={s.faqAnswer}>{item.answer}</Text>
              )}
            </View>
          ))}
        </View>

        {/* ── Legal ── */}
        <SectionHeader title="Legal" />
        <View style={s.card}>
          <RowItem
            icon="document-text-outline"
            label="Privacy Policy"
            onPress={() =>
              openLink(`${WEBSITE_URL}/privacy`)
            }
          />
          <View style={s.divider} />
          <RowItem
            icon="shield-checkmark-outline"
            label="Terms of Service"
            onPress={() =>
              openLink(`${WEBSITE_URL}/terms`)
            }
          />
        </View>

        <Text style={s.buildInfo}>
          DESocial • {APP_VERSION} • Made with ❤️ at DES Pune
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },
    scrollContent: {
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 40,
    },
    sectionHeader: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      marginBottom: 8,
      marginTop: 8,
      paddingHorizontal: 4,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 13,
    },
    rowIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    rowContent: {
      flex: 1,
    },
    rowLabel: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
    },
    rowValue: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginLeft: 62,
    },
    aboutBanner: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 12,
    },
    logoCircle: {
      width: 52,
      height: 52,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    logoText: {
      fontSize: 20,
      fontWeight: "900",
      color: "#FFFFFF",
      letterSpacing: -1,
    },
    appName: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    appVersion: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    aboutDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    faqRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 13,
      gap: 8,
    },
    faqQuestion: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },
    faqAnswer: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 19,
      paddingHorizontal: 16,
      paddingBottom: 14,
    },
    buildInfo: {
      textAlign: "center",
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 4,
      marginBottom: 8,
    },
  });
