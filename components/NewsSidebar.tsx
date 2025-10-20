import { useThemeColors } from "@/constants/Colors";
import { getJoinedCommunities } from "@/data/communityData";
import { mockCommunityPosts } from "@/data/communityPosts";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NewsItem {
  id: string;
  title: string;
  timeAgo: string;
  readers?: string;
  community?: string;
}

interface PuzzleItem {
  id: string;
  name: string;
  icon: string;
  connections: string;
}

interface NewsSidebarProps {
  news?: NewsItem[];
  puzzles?: PuzzleItem[];
}

// Function to generate headlines from community posts
const generateCommunityHeadlines = (): NewsItem[] => {
  const joinedCommunities = getJoinedCommunities();
  const joinedCommunityIds = joinedCommunities.map(c => c.id);
  
  // Filter posts from joined communities and sort by engagement
  const joinedCommunityPosts = mockCommunityPosts
    .filter(post => post.community && joinedCommunityIds.includes(post.community.id))
    .sort((a, b) => b.engagement.likes + b.engagement.comments - (a.engagement.likes + a.engagement.comments));

  const headlines: NewsItem[] = [
    {
      id: "h1",
      title: "Binary Search Trees Discussion Sparks CS Interest",
      timeAgo: "2h ago",
      readers: "24 likes",
      community: "Computer Science Club",
    },
    {
      id: "h2", 
      title: "Basketball Team Prepares for Championship Match",
      timeAgo: "4h ago",
      readers: "45 likes",
      community: "Basketball Team",
    },
    {
      id: "h3",
      title: "Music Society Announces Acoustic Night Event",
      timeAgo: "6h ago", 
      readers: "67 likes",
      community: "Music Society",
    },
    {
      id: "h4",
      title: "AI Ethics Debate Draws Large Campus Crowd",
      timeAgo: "8h ago",
      readers: "32 likes", 
      community: "Debate Society",
    },
    {
      id: "h5",
      title: "Photography Club Captures Stunning Campus Sunset",
      timeAgo: "12h ago",
      readers: "89 likes",
      community: "Photography Club",
    },
  ];

  return headlines;
};

const defaultPuzzles: PuzzleItem[] = [
  {
    id: "1",
    name: "Code Challenge #49",
    icon: "code-slash",
    connections: "CS Club challenge",
  },
  {
    id: "2", 
    name: "Photo Contest #196",
    icon: "camera",
    connections: "20 submissions received",
  },
  {
    id: "3",
    name: "Music Quiz #357", 
    icon: "musical-notes",
    connections: "5 participants joined",
  },
  {
    id: "4",
    name: "Debate Topic #517",
    icon: "chatbubbles",
    connections: "7 arguments posted",
  },
];

export default function NewsSidebar({
  news = generateCommunityHeadlines(),
  puzzles = defaultPuzzles,
}: NewsSidebarProps) {
  const colors = useThemeColors();

  const renderNewsItem = (item: NewsItem) => (
    <TouchableOpacity key={item.id} style={styles(colors).newsItem}>
      <Text style={styles(colors).newsTitle}>{item.title}</Text>
      <View style={styles(colors).newsMetadata}>
        <Text style={styles(colors).newsTime}>{item.timeAgo}</Text>
        {item.readers && (
          <>
            <Text style={styles(colors).newsDot}> • </Text>
            <Text style={styles(colors).newsReaders}>{item.readers}</Text>
          </>
        )}
        {item.community && (
          <>
            <Text style={styles(colors).newsDot}> • </Text>
            <Text style={styles(colors).newsCommunity}>{item.community}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderPuzzleItem = (item: PuzzleItem) => (
    <TouchableOpacity key={item.id} style={styles(colors).puzzleItem}>
      <View style={styles(colors).puzzleIconContainer}>
        <Ionicons
          name={item.icon as any}
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles(colors).puzzleContent}>
        <Text style={styles(colors).puzzleName}>{item.name}</Text>
        <Text style={styles(colors).puzzleConnections}>{item.connections}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles(colors).container}>
      {/* LinkedIn News Section */}
      <View style={styles(colors).section}>
        <View style={styles(colors).sectionHeader}>
          <Text style={styles(colors).sectionTitle}>Community Highlights</Text>
          <Ionicons name="information-circle" size={16} color={colors.textSecondary} />
        </View>
        
        <View style={styles(colors).subSectionHeader}>
          <Text style={styles(colors).subSectionTitle}>Trending from your communities</Text>
        </View>

        <ScrollView style={styles(colors).newsContainer} showsVerticalScrollIndicator={false}>
          {news.map(renderNewsItem)}
          
          <TouchableOpacity style={styles(colors).showMoreButton}>
            <Text style={styles(colors).showMoreText}>Show more</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Today's Community Activities Section */}
      <View style={styles(colors).section}>
        <View style={styles(colors).sectionHeader}>
          <Text style={styles(colors).sectionTitle}>Community Activities</Text>
        </View>

        <ScrollView style={styles(colors).puzzlesContainer} showsVerticalScrollIndicator={false}>
          {puzzles.map(renderPuzzleItem)}
          
          <TouchableOpacity style={styles(colors).showMoreButton}>
            <Text style={styles(colors).showMoreText}>Show more</Text>
            <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Footer Links */}
      <View style={styles(colors).footerSection}>
        <View style={styles(colors).footerLinks}>
          <TouchableOpacity><Text style={styles(colors).footerLink}>About</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles(colors).footerLink}>Accessibility</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles(colors).footerLink}>Help Center</Text></TouchableOpacity>
        </View>
        <View style={styles(colors).footerLinks}>
          <TouchableOpacity><Text style={styles(colors).footerLink}>Privacy & Terms</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles(colors).footerLink}>Ad Choices</Text></TouchableOpacity>
        </View>
        {/* <View style={styles(colors).footerLinks}>
          <TouchableOpacity><Text style={styles(colors).footerLink}>Advertising</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles(colors).footerLink}>Business Services</Text></TouchableOpacity>
        </View> */}
        <View style={styles(colors).footerLinks}>
          <TouchableOpacity><Text style={styles(colors).footerLink}>Get the DESocial app</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles(colors).footerLink}>More</Text></TouchableOpacity>
        </View>
        
        <Text style={styles(colors).footerCopyright}>
          DESocial © 2025
        </Text>
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      width: 320,
      marginLeft: 16,
    },
    section: {
      backgroundColor: colors.cardBackground || "#FFFFFF",
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      overflow: "hidden",
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.text,
    },
    subSectionHeader: {
      paddingHorizontal: 16,
      paddingBottom: 8,
    },
    subSectionTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
    },
    newsContainer: {
      maxHeight: 300,
    },
    newsItem: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    newsTitle: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 4,
      lineHeight: 18,
    },
    newsMetadata: {
      flexDirection: "row",
      alignItems: "center",
    },
    newsTime: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    newsDot: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    newsReaders: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    newsCommunity: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: "500",
    },
    puzzlesContainer: {
      maxHeight: 200,
    },
    puzzleItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    puzzleIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    puzzleContent: {
      flex: 1,
    },
    puzzleName: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 2,
    },
    puzzleConnections: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    showMoreButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    showMoreText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginRight: 4,
    },
    footerSection: {
      backgroundColor: colors.cardBackground || "#FFFFFF",
      borderRadius: 12,
      padding: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    footerLinks: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 8,
    },
    footerLink: {
      fontSize: 12,
      color: colors.textSecondary,
      marginRight: 16,
      marginBottom: 4,
    },
    footerCopyright: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 8,
      textAlign: "center",
    },
  });