// Search-related types for Firebase integration
import { Post } from "./post";
import { UserProfile } from "./profile";

export enum SearchResultType {
  POST = "post",
  USER = "user",
  COMMUNITY = "community",
}

export interface Community {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  coverImage?: string;
  memberCount: number;
  postCount: number;
  category: CommunityCategory;
  isPublic: boolean;
  tags: string[];
  // Firebase specific fields
  createdAt?: any; // Firebase Timestamp
  updatedAt?: any; // Firebase Timestamp
}

export enum CommunityCategory {
  ACADEMIC = "academic",
  SPORTS = "sports",
  CULTURAL = "cultural",
  TECHNICAL = "technical",
  SOCIAL = "social",
  VOLUNTEER = "volunteer",
  HOBBY = "hobby",
}

export interface SearchFilters {
  type?: SearchResultType[];
  category?: CommunityCategory[];
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

// For Firebase integration
export interface SearchQuery {
  query: string;
  filters: SearchFilters;
  limit: number;
  lastVisible?: any; // Firebase QueryDocumentSnapshot
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  userId: string;
}
