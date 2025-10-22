// Profile-specific types extending the base User type

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  prn?: string;
  department?: string;
  // deprecated/unused in UI
  stats?: {
    followers?: number;
    following?: number;
    posts?: number;
  };
};

// For Firebase integration
export interface UserProfileFirestore extends Omit<UserProfile, 'joinedDate'> {
  joinedDate: any; // Firebase Timestamp
}

// Profile screen props
export interface ProfileScreenProps {
  userId?: string; // If viewing someone else's profile
  isOwnProfile?: boolean;
}