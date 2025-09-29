import { UserProfile } from "@/types/profile";
import { Community, CommunityCategory } from "@/types/search";

// Mock communities data
export const mockCommunities: Community[] = [
  {
    id: "comm1",
    name: "CS Club",
    description:
      "Computer Science enthusiasts sharing knowledge, projects, and career opportunities.",
    avatar:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop",
    memberCount: 1247,
    postCount: 3890,
    category: CommunityCategory.TECHNICAL,
    isPublic: true,
    tags: ["coding", "programming", "tech", "internships"],
  },
  {
    id: "comm2",
    name: "Basketball Club",
    description:
      "Join us for games, tournaments, and improving your basketball skills!",
    avatar:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=200&fit=crop",
    memberCount: 892,
    postCount: 2156,
    category: CommunityCategory.SPORTS,
    isPublic: true,
    tags: ["basketball", "sports", "tournament", "fitness"],
  },
  {
    id: "comm3",
    name: "Photography Society",
    description:
      "Capturing moments, sharing techniques, and exploring visual storytelling.",
    avatar:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=200&fit=crop",
    memberCount: 567,
    postCount: 1890,
    category: CommunityCategory.CULTURAL,
    isPublic: true,
    tags: ["photography", "art", "creative", "exhibitions"],
  },
  {
    id: "comm4",
    name: "Debate Society",
    description:
      "Sharpen your argumentative skills and engage in intellectual discussions.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
    memberCount: 334,
    postCount: 1245,
    category: CommunityCategory.ACADEMIC,
    isPublic: true,
    tags: ["debate", "public speaking", "academic", "competitions"],
  },
  {
    id: "comm5",
    name: "Environmental Club",
    description:
      "Working together for a sustainable future and environmental awareness.",
    avatar:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&h=200&fit=crop",
    memberCount: 445,
    postCount: 892,
    category: CommunityCategory.VOLUNTEER,
    isPublic: true,
    tags: ["environment", "sustainability", "volunteer", "green"],
  },
  {
    id: "comm6",
    name: "Music Club",
    description:
      "For all music lovers - jamming, performances, and music production.",
    avatar:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop",
    coverImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
    memberCount: 723,
    postCount: 2567,
    category: CommunityCategory.CULTURAL,
    isPublic: true,
    tags: ["music", "instruments", "performance", "creative"],
  },
];

// Mock users data for search
export const mockSearchUsers: UserProfile[] = [
  {
    id: "search_user1",
    username: "john_doe",
    displayName: "John Doe",
    prn: "PRN2023001",
    avatar: "https://i.pravatar.cc/150?img=13",
    bio: "CS Senior | App Developer | Coffee enthusiast ☕",
    location: "New York, NY",
    joinedDate: new Date("2023-08-15"),
    isPrivate: false,
    verified: true,
    department: "Computer Science",
    year: "Senior",
    batch: "2024",
    stats: {
      postsCount: 234,
      followersCount: 1567,
      followingCount: 892,
    },
  },
  {
    id: "search_user2",
    username: "jane_smith",
    displayName: "Jane Smith",
    prn: "PRN2023002",
    avatar: "https://i.pravatar.cc/150?img=14",
    bio: "Art major | Digital artist | Part-time photographer 📸",
    location: "Los Angeles, CA",
    joinedDate: new Date("2023-09-01"),
    isPrivate: false,
    department: "Fine Arts",
    year: "Junior",
    batch: "2025",
    stats: {
      postsCount: 156,
      followersCount: 892,
      followingCount: 445,
    },
  },
  {
    id: "search_user3",
    username: "mike_wilson",
    displayName: "Mike Wilson",
    prn: "PRN2022045",
    avatar: "https://i.pravatar.cc/150?img=15",
    bio: "Engineering student | Basketball player | Tech blogger",
    location: "Chicago, IL",
    joinedDate: new Date("2022-08-20"),
    isPrivate: false,
    department: "Mechanical Engineering",
    year: "Senior",
    batch: "2024",
    stats: {
      postsCount: 89,
      followersCount: 567,
      followingCount: 234,
    },
  },
  {
    id: "search_user4",
    username: "sarah_johnson",
    displayName: "Sarah Johnson",
    prn: "PRN2024010",
    avatar: "https://i.pravatar.cc/150?img=16",
    bio: "Psychology major | Mental health advocate | Book lover 📚",
    location: "Boston, MA",
    joinedDate: new Date("2024-01-15"),
    isPrivate: false,
    department: "Psychology",
    year: "Sophomore",
    batch: "2026",
    stats: {
      postsCount: 67,
      followersCount: 334,
      followingCount: 189,
    },
  },
  {
    id: "search_user5",
    username: "alex_chen",
    displayName: "Alex Chen",
    prn: "PRN2023078",
    avatar: "https://i.pravatar.cc/150?img=17",
    bio: "Business student | Entrepreneur | Startup enthusiast 🚀",
    location: "San Francisco, CA",
    joinedDate: new Date("2023-09-10"),
    isPrivate: false,
    verified: true,
    department: "Business Administration",
    year: "Junior",
    batch: "2025",
    stats: {
      postsCount: 178,
      followersCount: 1234,
      followingCount: 567,
    },
  },
];

// Helper function to format member count
export const formatMemberCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// Helper function to get category color
export const getCategoryColor = (category: CommunityCategory): string => {
  const categoryColors = {
    [CommunityCategory.ACADEMIC]: "#3B82F6",
    [CommunityCategory.SPORTS]: "#EF4444",
    [CommunityCategory.CULTURAL]: "#8B5CF6",
    [CommunityCategory.TECHNICAL]: "#10B981",
    [CommunityCategory.SOCIAL]: "#F59E0B",
    [CommunityCategory.VOLUNTEER]: "#06B6D4",
    [CommunityCategory.HOBBY]: "#EC4899",
  };
  return categoryColors[category];
};
