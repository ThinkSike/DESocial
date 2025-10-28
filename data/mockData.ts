import { Post } from "@/types/post";

// Mock data for posts
export const mockPosts: Post[] = [
  {
    id: "1",
    user: {
      id: "user1",
      username: "techguru",
      displayName: "Alex Chen",
      avatar: "https://i.pravatar.cc/150?img=1",
      verified: true,
    },
    content: {
      text: "Just shipped a new feature that reduces app load time by 40%! The key was optimizing our bundle size and implementing proper code splitting. Sometimes the smallest changes make the biggest impact. 🚀",
    },
    engagement: {
      likes: 234,
      reposts: 45,
      comments: 12,
      shares: 8,
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    user: {
      id: "user2",
      username: "designqueen",
      displayName: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    content: {
      text: "Working on some new UI concepts for our mobile app. What do you think about this color palette?",
      images: [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=300&fit=crop",
      ],
    },
    engagement: {
      likes: 89,
      reposts: 23,
      comments: 31,
      shares: 5,
    },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: "3",
    user: {
      id: "user3",
      username: "foodieblogger",
      displayName: "Mike Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    content: {
      text: "Made this incredible pasta dish tonight! The secret is in the fresh herbs and a touch of truffle oil. Recipe in the comments below 👇",
      images: [
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop",
      ],
    },
    engagement: {
      likes: 156,
      reposts: 12,
      comments: 28,
      shares: 15,
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
  {
    id: "4",
    user: {
      id: "user4",
      username: "startuplife",
      displayName: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=4",
      verified: true,
    },
    content: {
      text: "Reminder: Your network is your net worth, but your knowledge is your leverage. Invest in both wisely. 💡\n\nWhat's the best piece of advice you've received this year?",
    },
    engagement: {
      likes: 445,
      reposts: 89,
      comments: 67,
      shares: 23,
    },
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: "5",
    user: {
      id: "user5",
      username: "naturephotographer",
      displayName: "David Park",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    content: {
      text: "Caught this amazing sunrise at Yosemite this morning. Nature never fails to inspire me.",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      ],
    },
    engagement: {
      likes: 789,
      reposts: 134,
      comments: 45,
      shares: 67,
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: "6",
    user: {
      id: "user6",
      username: "bookworm",
      displayName: "Lisa Thompson",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
    content: {
      text: 'Just finished reading "Atomic Habits" and I\'m blown away. The 1% better every day concept is so simple yet powerful. What book has changed your perspective recently?',
    },
    engagement: {
      likes: 67,
      reposts: 15,
      comments: 42,
      shares: 8,
    },
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "7",
    user: {
      id: "user7",
      username: "fitnesscoach",
      displayName: "Mark Stevens",
      avatar: "https://i.pravatar.cc/150?img=7",
      verified: true,
    },
    content: {
      text: "Your Monday motivation: You don't have to be great to get started, but you have to get started to be great.",
      images: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      ],
    },
    engagement: {
      likes: 523,
      reposts: 78,
      comments: 34,
      shares: 45,
    },
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "8",
    user: {
      id: "user8",
      username: "cryptotrader",
      displayName: "James Mitchell",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    content: {
      text: "Market analysis for this week: BTC showing strong support at 42k. Altcoin season might be around the corner. Remember to DYOR and never invest more than you can afford to lose! 📈",
    },
    engagement: {
      likes: 234,
      reposts: 56,
      comments: 89,
      shares: 12,
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: "9",
    user: {
      id: "user9",
      username: "travelbug",
      displayName: "Anna Garcia",
      avatar: "https://i.pravatar.cc/150?img=9",
    },
    content: {
      text: "Currently in Santorini and the views are absolutely breathtaking! Sometimes you need to step away from the screen and soak in the beauty around you. 🌅",
      images: [
        "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop",
      ],
    },
    engagement: {
      likes: 892,
      reposts: 145,
      comments: 76,
      shares: 234,
    },
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
  },
  {
    id: "10",
    user: {
      id: "user10",
      username: "codemaster",
      displayName: "Ryan Cooper",
      avatar: "https://i.pravatar.cc/150?img=10",
      verified: true,
    },
    content: {
      text: "Pro tip: Always write code as if the person who ends up maintaining it is a violent psychopath who knows where you live. Clean code saves lives! 😄\n\n#programming #cleancode",
    },
    engagement: {
      likes: 1245,
      reposts: 234,
      comments: 123,
      shares: 89,
    },
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: "11",
    user: {
      id: "user11",
      username: "musiclover",
      displayName: "Sophie Brown",
      avatar: "https://i.pravatar.cc/150?img=11",
    },
    content: {
      text: "Just discovered this amazing indie band and I can't stop listening to their latest album. Music has this incredible power to transport you to different emotional spaces. What song is currently on repeat for you?",
    },
    engagement: {
      likes: 78,
      reposts: 23,
      comments: 67,
      shares: 12,
    },
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
  },
  {
    id: "12",
    user: {
      id: "user12",
      username: "artcollector",
      displayName: "Oliver Davis",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    content: {
      text: "Visited the new contemporary art exhibition today. This piece really spoke to me about the intersection of technology and human emotion.",
      images: [
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      ],
    },
    engagement: {
      likes: 134,
      reposts: 45,
      comments: 28,
      shares: 19,
    },
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
  },
];

export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w`;
  }

  return date.toLocaleDateString();
};

export const formatEngagementNumber = (num?: number): string => {
  if (!num && num !== 0) {
    return "0";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
};
