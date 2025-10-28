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
  hashtags?: string[];
}

export interface PostEngagement {
  likes: number;
  comments: number;
}

export interface Post {
  id: string;
  user: User;
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
  // Firebase specific fields that can be added later
  createdAt?: any; // Firebase Timestamp
  updatedAt?: any; // Firebase Timestamp
}

export enum PostType {
  TEXT = "text",
  IMAGE = "image",
  MIXED = "mixed",
}
