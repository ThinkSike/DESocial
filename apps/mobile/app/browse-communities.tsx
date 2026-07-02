import { useThemeColors } from "@/constants/Colors";
import { browseCommunities } from "@/data/browseCommunities";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BrowseCommunitiesScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const trendingCommunities = browseCommunities.filter((community) => community.isTrending);
  const otherCommunities = browseCommunities.filter((community) => !community.isTrending);

  const openCommunityFeed = (communityId: string) => {
    router.push(`/forum?community=${encodeURIComponent(communityId)}` as any);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.cardBackground }]}> 
        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { borderColor: colors.border, backgroundColor: colors.background }]}
          >
            <Ionicons name="arrow-back" size={18} color={colors.text} />
            <Text style={[styles.backButtonText, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Browse Communities</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}> 
          Explore the groups available on your campus
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending communities</Text>
          <View style={styles.grid}>
            {trendingCommunities.map((community) => (
              <View
                key={community.id}
                style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              >
                <View style={[styles.iconWrap, { backgroundColor: community.accent + "20" }]}>
                  <Ionicons name={community.icon as any} size={22} color={community.accent} />
                </View>
                <Text style={[styles.name, { color: colors.text }]}>{community.name}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                  {community.description}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="people" size={14} color={colors.textSecondary} />
                  <Text style={[styles.members, { color: colors.textSecondary }]}>{community.members}</Text>
                </View>
                <TouchableOpacity style={[styles.viewButton, { borderColor: community.accent }]} onPress={() => openCommunityFeed(community.id)}>
                  <Text style={[styles.viewButtonText, { color: community.accent }]}>Open posts</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>More communities</Text>
          <View style={styles.grid}>
            {otherCommunities.map((community) => (
              <View
                key={community.id}
                style={[styles.card, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}
              >
                <View style={[styles.iconWrap, { backgroundColor: community.accent + "20" }]}>
                  <Ionicons name={community.icon as any} size={22} color={community.accent} />
                </View>
                <Text style={[styles.name, { color: colors.text }]}>{community.name}</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                  {community.description}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="people" size={14} color={colors.textSecondary} />
                  <Text style={[styles.members, { color: colors.textSecondary }]}>{community.members}</Text>
                </View>
                <TouchableOpacity style={[styles.viewButton, { borderColor: community.accent }]} onPress={() => openCommunityFeed(community.id)}>
                  <Text style={[styles.viewButtonText, { color: community.accent }]}>Open posts</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  headerTopRow: {
    marginBottom: 12,
    alignItems: "flex-start",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    minWidth: 220,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 14,
  },
  members: {
    fontSize: 12,
    fontWeight: "500",
  },
  viewButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
  },
  viewButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
});