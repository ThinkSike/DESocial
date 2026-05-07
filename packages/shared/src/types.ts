export interface PostUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string | null;
  verified?: boolean;
}

export interface PostContent {
  text?: string;
  images?: string[];
  hashtags?: string[];
}

export interface PostEngagement {
  likes: number;
  comments: number;
}

export interface Post {
  id: string;
  user: PostUser;
  content: PostContent;
  engagement: PostEngagement;
  timestamp: Date;
  community?: {
    id: string;
    name: string;
    icon: string;
  };
  event?: {
    title: string;
    date: Date;
    locationId: string;
    type: "upcoming" | "ongoing" | "completed";
  };
  createdAt: Date;
  updatedAt: Date;
}

export type PostType = "text" | "image" | "mixed";

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  prn?: string | null;
  department?: string | null;
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type CommunityType =
  | "academic"
  | "sports"
  | "cultural"
  | "technical"
  | "social"
  | "hobby";

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  type: CommunityType;
  memberCount: number;
  isJoined: boolean;
  coverImage?: string | null;
  icon?: string | null;
  isVerified?: boolean;
  location?: string | null;
  tags: string[];
  recentActivity?: string | null;
  trending?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityMember {
  communityId: string;
  userId: string;
  role: "member" | "moderator" | "admin";
  joinedAt: Date;
}

export type SearchResultType = "post" | "user" | "community";

export interface SearchFilters {
  type?: SearchResultType[];
  category?: CommunityType[];
  verified?: boolean;
  timeRange?: "day" | "week" | "month" | "year" | "all";
}

export interface SearchResult {
  type: SearchResultType;
  data: Post | UserProfile | Community;
  relevanceScore?: number;
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  loading: boolean;
  hasMore: boolean;
  error?: string;
}
