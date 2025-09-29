// Types for Firebase integration
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  verified?: boolean;
}

export interface PostContent {
  text?: string;
  images?: string[];
}

export interface PostEngagement {
  likes: number;
  reposts: number;
  comments: number;
  shares: number;
}

export interface Post {
  id: string;
  user: User;
  content: PostContent;
  engagement: PostEngagement;
  timestamp: Date;
  // Firebase specific fields that can be added later
  createdAt?: any; // Firebase Timestamp
  updatedAt?: any; // Firebase Timestamp
}

export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  MIXED = 'mixed'
}