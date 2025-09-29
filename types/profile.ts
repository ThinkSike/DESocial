// Profile-specific types extending the base User type
import { User } from './post';

export interface UserProfile extends User {
  prn: string; // Primary Registration Number - unique college identifier
  displayName: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedDate: Date;
  isPrivate: boolean;
  stats: ProfileStats;
  // Academic info (optional)
  department?: string;
  year?: string;
  batch?: string;
}

export interface ProfileStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface FollowRelation {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

// For Firebase integration
export interface UserProfileFirestore extends Omit<UserProfile, 'joinedDate'> {
  joinedDate: any; // Firebase Timestamp
}

// Profile screen props
export interface ProfileScreenProps {
  userId?: string; // If viewing someone else's profile
  isOwnProfile?: boolean;
}