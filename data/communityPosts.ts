import { Post } from "@/types/post";

// Mock community posts data
export const mockCommunityPosts: Post[] = [
  {
    id: "cp1",
    user: {
      id: "user1",
      username: "alex_kumar",
      displayName: "Alex Kumar",
      avatar: "https://i.pravatar.cc/150?img=2",
      verified: false,
    },
    community: {
      id: "cs-club",
      name: "Computer Science Club",
      icon: "code-slash",
    },
    content: {
      text: "Just finished implementing a binary search tree in Python! 🌳 The recursive approach for insertion and deletion was quite elegant. Anyone interested in discussing different tree traversal algorithms?",
      hashtags: ["#DataStructures", "#Python", "#Algorithms"],
    },
    engagement: {
      likes: 24,
      reposts: 3,
      comments: 8,
      shares: 2,
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "cp2",
    user: {
      id: "user2",
      username: "priya_sports",
      displayName: "Priya Sharma",
      avatar: "https://i.pravatar.cc/150?img=3",
      verified: true,
    },
    community: {
      id: "basketball-team",
      name: "Basketball Team",
      icon: "basketball",
    },
    content: {
      text: "Great practice session today! 🏀 Our new defensive strategy is really coming together. Remember - tomorrow's match against Engineering College at 4 PM. Let's bring our A-game!",
      images: [
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=400&fit=crop",
      ],
    },
    event: {
      title: "Basketball Match vs Engineering College",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      locationId: "basketball-court",
      type: "upcoming",
    },
    engagement: {
      likes: 45,
      reposts: 12,
      comments: 15,
      shares: 8,
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: "cp3",
    user: {
      id: "user3",
      username: "raj_music",
      displayName: "Raj Patel",
      avatar: "https://i.pravatar.cc/150?img=4",
      verified: false,
    },
    community: {
      id: "music-society",
      name: "Music Society",
      icon: "musical-notes",
    },
    content: {
      text: "🎵 Excited to announce our upcoming acoustic night! We're looking for talented singers, guitarists, and songwriters to perform. DM me if you're interested in showcasing your skills.",
      hashtags: ["#AcousticNight", "#LiveMusic", "#TalentShow"],
    },
    event: {
      title: "Acoustic Night - Open Mic",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      locationId: "music-room",
      type: "upcoming",
    },
    engagement: {
      likes: 67,
      reposts: 18,
      comments: 23,
      shares: 12,
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: "cp4",
    user: {
      id: "user4",
      username: "maya_debate",
      displayName: "Maya Singh",
      avatar: "https://i.pravatar.cc/150?img=5",
      verified: false,
    },
    community: {
      id: "debate-society",
      name: "Debate Society",
      icon: "chatbubbles",
    },
    content: {
      text: "Today's debate topic: 'Should AI replace human decision-making in critical sectors?' 🤖 Looking forward to some thought-provoking arguments from both sides. Meeting at 5 PM in the main auditorium.",
    },
    event: {
      title: "AI Ethics Debate",
      date: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now (today 5 PM)
      locationId: "main-auditorium",
      type: "upcoming",
    },
    engagement: {
      likes: 32,
      reposts: 8,
      comments: 28,
      shares: 5,
    },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: "cp5",
    user: {
      id: "user5",
      username: "arjun_photo",
      displayName: "Arjun Mehta",
      avatar: "https://i.pravatar.cc/150?img=6",
      verified: false,
    },
    community: {
      id: "photography-club",
      name: "Photography Club",
      icon: "camera",
    },
    content: {
      text: "Captured this stunning sunset from the campus rooftop yesterday 📸 The golden hour lighting was absolutely perfect! What's your favorite time of day for photography?",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop",
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=400&fit=crop",
      ],
      hashtags: ["#GoldenHour", "#CampusPhotography", "#Sunset"],
    },
    engagement: {
      likes: 89,
      reposts: 25,
      comments: 18,
      shares: 15,
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: "cp6",
    user: {
      id: "user6",
      username: "neha_eco",
      displayName: "Neha Gupta",
      avatar: "https://i.pravatar.cc/150?img=7",
      verified: true,
    },
    community: {
      id: "eco-warriors",
      name: "Eco Warriors",
      icon: "leaf",
    },
    content: {
      text: "🌱 Join us for the campus cleanup drive this Saturday! We've already collected 200kg of recyclable waste this month. Every small action counts towards a greener campus. Bring your friends!",
      hashtags: ["#EcoFriendly", "#CleanupDrive", "#Sustainability"],
    },
    event: {
      title: "Campus Cleanup Drive",
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // This Saturday
      locationId: "eco-garden",
      type: "upcoming",
    },
    engagement: {
      likes: 156,
      reposts: 42,
      comments: 31,
      shares: 28,
    },
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
  },
  {
    id: "cp7",
    user: {
      id: "user7",
      username: "karan_startup",
      displayName: "Karan Singh",
      avatar: "https://i.pravatar.cc/150?img=8",
      verified: false,
    },
    community: {
      id: "entrepreneurs-club",
      name: "Entrepreneurs Club",
      icon: "bulb",
    },
    content: {
      text: "💡 Pitch competition update: We received 50+ innovative startup ideas! The preliminary round is next Friday. Top 10 teams will present to our panel of industry experts. May the best idea win!",
    },
    engagement: {
      likes: 73,
      reposts: 19,
      comments: 22,
      shares: 11,
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "cp8",
    user: {
      id: "user8",
      username: "kavya_art",
      displayName: "Kavya Reddy",
      avatar: "https://i.pravatar.cc/150?img=9",
      verified: false,
    },
    community: {
      id: "art-society",
      name: "Art Society",
      icon: "brush",
    },
    content: {
      text: "🎨 Work in progress on my latest acrylic painting! This piece explores the theme of urban isolation through abstract expressionism. Would love to hear your thoughts and interpretations.",
      images: [
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop",
      ],
      hashtags: ["#AbstractArt", "#AcrylicPainting", "#ArtWork"],
    },
    engagement: {
      likes: 112,
      reposts: 28,
      comments: 35,
      shares: 19,
    },
    timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000), // 30 hours ago
  },
];

// Function to get posts from specific community
export const getPostsByCommunity = (communityId: string): Post[] => {
  return mockCommunityPosts.filter(
    (post) => post.community?.id === communityId,
  );
};

// Function to get all community posts
export const getAllCommunityPosts = (): Post[] => {
  return mockCommunityPosts;
};

// Function to get posts from joined communities
export const getJoinedCommunitiesPosts = (
  joinedCommunityIds: string[],
): Post[] => {
  return mockCommunityPosts.filter(
    (post) => post.community && joinedCommunityIds.includes(post.community.id),
  );
};
